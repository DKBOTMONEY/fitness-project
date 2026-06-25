import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Check user subscription status
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionStatus: true, stripeCustomerId: true },
    });

    if (dbUser?.subscriptionStatus === "ACTIVE") {
      if (dbUser.stripeCustomerId) {
        // User already subscribed, redirect to Stripe Billing Customer Portal
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: dbUser.stripeCustomerId,
          return_url: `${appUrl}/dashboard/subscription`,
        });
        return NextResponse.json({ url: portalSession.url });
      } else {
        return NextResponse.json(
          { error: "You already have an active subscription." },
          { status: 400 }
        );
      }
    }

    const checkoutConfig: any = {
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "thb",
            product_data: {
              name: "Hundee Pro Subscription",
              description: "Unlock all premium workouts, nutrition tracker tabs, and advanced analytics.",
            },
            unit_amount: 10000, // 100 THB in satang
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
      success_url: `${appUrl}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/subscription?canceled=true`,
    };

    if (dbUser?.stripeCustomerId) {
      checkoutConfig.customer = dbUser.stripeCustomerId;
    } else {
      checkoutConfig.customer_email = session.user.email;
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutConfig);

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
