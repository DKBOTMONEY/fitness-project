import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        const userId = session.metadata?.userId;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const stripeCustomerId = session.customer as string;

        const subscriptionId = session.subscription as string;
        const now = new Date();
        let endDate = new Date(now);
        endDate.setMonth(now.getMonth() + 1); // Default 1 calendar month

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
          endDate = new Date(subscription.current_period_end * 1000);
        }

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: "ACTIVE",
              subscriptionEndDate: endDate,
              stripeCustomerId,
            },
          });
          console.log(`[Stripe Webhook] Updated subscription status for user: ${userId}`);
        } else if (customerEmail) {
          await prisma.user.update({
            where: { email: customerEmail },
            data: {
              subscriptionStatus: "ACTIVE",
              subscriptionEndDate: endDate,
              stripeCustomerId,
            },
          });
          console.log(`[Stripe Webhook] Updated subscription status for email: ${customerEmail}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        
        // Retrieve customer to get email
        const customer = await stripe.customers.retrieve(customerId) as any;
        const email = customer.email;

        if (email) {
          await prisma.user.update({
            where: { email },
            data: {
              subscriptionStatus: "EXPIRED",
            },
          });
          console.log(`[Stripe Webhook] Expired subscription for customer: ${email}`);
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Stripe Webhook Handler Error]:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
