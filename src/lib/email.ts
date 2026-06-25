import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Use an App Password for Gmail
  },
});

// Shared Email Layout System
const createEmailTemplate = (title: string, preheader: string, bodyContent: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          background-color: #0a0a0a;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        table {
          border-spacing: 0;
          width: 100%;
        }
        td {
          padding: 0;
        }
        img {
          border: 0;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #0a0a0a;
          padding-top: 40px;
          padding-bottom: 40px;
        }
        .main-table {
          background-color: #121212;
          margin: 0 auto;
          width: 100%;
          max-width: 600px;
          border-spacing: 0;
          font-family: sans-serif;
          color: #f5f5f5;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }
        .header {
          padding: 40px 40px 20px 40px;
          text-align: center;
        }
        .logo-box {
          display: inline-block;
          width: 48px;
          height: 48px;
          line-height: 48px;
          background-color: #FF5722;
          color: #ffffff;
          border-radius: 14px;
          font-weight: 900;
          font-size: 24px;
          text-align: center;
          margin-bottom: 12px;
          box-shadow: 0 8px 24px rgba(255, 87, 34, 0.25);
        }
        .brand-name {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 0.1em;
          color: #ffffff;
          margin: 0;
          text-transform: uppercase;
        }
        .brand-sub {
          font-size: 11px;
          font-weight: 700;
          color: #666666;
          margin: 4px 0 0 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .content {
          padding: 20px 40px 40px 40px;
        }
        .btn-container {
          text-align: center;
          margin: 35px 0;
        }
        .btn {
          display: inline-block;
          padding: 16px 36px;
          background-color: #FF5722;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 800;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          box-shadow: 0 10px 25px rgba(255, 87, 34, 0.3);
          transition: transform 0.2s ease;
        }
        .footer {
          padding: 40px;
          background-color: #0d0d0d;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
        }
        .footer-text {
          font-size: 11px;
          color: #444444;
          line-height: 1.6;
          margin: 0;
        }
        .footer-links {
          margin-bottom: 16px;
        }
        .footer-link {
          color: #666666;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          margin: 0 10px;
        }
        .footer-link:hover {
          color: #FF5722;
        }
        /* Mobile overrides */
        @media screen and (max-width: 600px) {
          .main-table {
            border-radius: 0;
            border: none;
          }
          .content {
            padding: 20px 24px 30px 24px;
          }
          .header {
            padding: 30px 24px 10px 24px;
          }
          .footer {
            padding: 30px 24px;
          }
        }
      </style>
    </head>
    <body>
      <!-- Preheader text -->
      <div style="display: none; max-height: 0px; overflow: hidden;">
        ${preheader}
      </div>
      
      <center class="wrapper">
        <table class="main-table">
          <tr>
            <td class="header">
              <div class="logo-box">H</div>
              <h1 class="brand-name">Hundee</h1>
              <p class="brand-sub">Active Protocol</p>
            </td>
          </tr>
          <tr>
            <td class="content">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td class="footer">
              <div class="footer-links">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/terms-of-service" class="footer-link">Terms of Service</a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/privacy-policy" class="footer-link">Privacy Policy</a>
              </div>
              <p class="footer-text">
                © 2026 Hundee. All rights reserved.<br>
                You are receiving this email because you registered on Hundee.
              </p>
            </td>
          </tr>
        </table>
      </center>
    </body>
    </html>
  `;
};

// 1. Verification Email
export const sendVerificationEmail = async (email: string, url: string) => {
  if (!process.env.GMAIL_USER || process.env.GMAIL_USER.includes("your-email") || !process.env.GMAIL_PASS || process.env.GMAIL_PASS.includes("your-app-password")) {
    console.warn("⚠️ SMTP credentials not configured. Verification email not sent.");
    console.log("Verification Link:", url);
    return;
  }

  const title = "Activate Your Hundee Account";
  const preheader = "Verify your email to activate your personalized fitness and nutrition dashboard.";
  const bodyContent = `
    <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 0; margin-bottom: 16px; text-transform: uppercase; tracking-tight: -0.02em;">Welcome to the Protocol</h2>
    <p style="color: #b3b3b3; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
      You are one step away from unlocking your personalized, automated workout plans and nutrition calculators. 
      Please verify your email address to activate your Hundee account.
    </p>
    <div class="btn-container">
      <a href="${url}" class="btn" target="_blank">Verify Account</a>
    </div>
    <p style="color: #666666; font-size: 11px; line-height: 1.6; margin: 24px 0 0 0;">
      If the button above does not work, copy and paste this URL into your browser:<br>
      <a href="${url}" style="color: #FF5722; text-decoration: none; word-break: break-all;">${url}</a>
    </p>
    <p style="color: #444444; font-size: 11px; line-height: 1.6; margin: 16px 0 0 0; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 16px;">
      This verification link will expire in 24 hours. If you did not register for a Hundee account, you can safely ignore this email.
    </p>
  `;

  const html = createEmailTemplate(title, preheader, bodyContent);

  const mailOptions = {
    from: `"Hundee Team" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "🔥 Activate Your Hundee Account",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// 2. Password Reset Email
export const sendPasswordResetEmail = async (email: string, url: string) => {
  if (!process.env.GMAIL_USER || process.env.GMAIL_USER.includes("your-email") || !process.env.GMAIL_PASS || process.env.GMAIL_PASS.includes("your-app-password")) {
    console.warn("⚠️ SMTP credentials not configured. Password reset email not sent.");
    console.log("Password Reset Link:", url);
    return;
  }

  const title = "Reset Your Hundee Password";
  const preheader = "Use this link to securely reset your password.";
  const bodyContent = `
    <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin-top: 0; margin-bottom: 16px; text-transform: uppercase; tracking-tight: -0.02em;">Password Reset Request</h2>
    <p style="color: #b3b3b3; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
      We received a request to reset the password for your Hundee account. 
      Click the button below to choose a new password.
    </p>
    <div class="btn-container">
      <a href="${url}" class="btn" target="_blank">Reset Password</a>
    </div>
    <p style="color: #666666; font-size: 11px; line-height: 1.6; margin: 24px 0 0 0;">
      If the button above does not work, copy and paste this URL into your browser:<br>
      <a href="${url}" style="color: #FF5722; text-decoration: none; word-break: break-all;">${url}</a>
    </p>
    <p style="color: #444444; font-size: 11px; line-height: 1.6; margin: 16px 0 0 0; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 16px;">
      This reset link is valid for 1 hour. If you did not request a password reset, you can safely ignore this email and your password will remain unchanged.
    </p>
  `;

  const html = createEmailTemplate(title, preheader, bodyContent);

  const mailOptions = {
    from: `"Hundee Team" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "🔐 Reset Your Hundee Password",
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};
