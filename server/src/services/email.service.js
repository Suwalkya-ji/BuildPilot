import tls from "tls";

/**
 * Pure Node.js TLS SMTP Sender (No external dependencies required)
 */
const sendViaSMTP = ({ host, port, user, pass, from, fromName, to, subject, htmlContent }) => {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, host, { rejectUnauthorized: false }, () => {
      let step = 0;

      const send = (cmd) => {
        socket.write(cmd + "\r\n");
      };

      socket.on("data", (data) => {
        const response = data.toString();

        if (step === 0 && response.startsWith("220")) {
          step = 1;
          send("EHLO buildpilot.ai");
        } else if (step === 1 && response.startsWith("250")) {
          step = 2;
          send("AUTH LOGIN");
        } else if (step === 2 && response.startsWith("334")) {
          step = 3;
          send(Buffer.from(user).toString("base64"));
        } else if (step === 3 && response.startsWith("334")) {
          step = 4;
          send(Buffer.from(pass).toString("base64"));
        } else if (step === 4 && response.startsWith("235")) {
          step = 5;
          send(`MAIL FROM:<${from}>`);
        } else if (step === 5 && response.startsWith("250")) {
          step = 6;
          send(`RCPT TO:<${to}>`);
        } else if (step === 6 && response.startsWith("250")) {
          step = 7;
          send("DATA");
        } else if (step === 7 && response.startsWith("354")) {
          step = 8;
          const mimeMessage = [
            `From: "${fromName}" <${from}>`,
            `To: <${to}>`,
            `Subject: ${subject}`,
            "MIME-Version: 1.0",
            'Content-Type: text/html; charset="UTF-8"',
            "",
            htmlContent,
            ".",
          ].join("\r\n");
          send(mimeMessage);
        } else if (step === 8 && response.startsWith("250")) {
          step = 9;
          send("QUIT");
          socket.end();
          resolve({ success: true, message: response.trim() });
        } else if (response.startsWith("4") || response.startsWith("5")) {
          socket.end();
          reject(new Error(`SMTP Server Error: ${response.trim()}`));
        }
      });

      socket.on("error", (err) => {
        reject(err);
      });
    });
  });
};

/**
 * Universal Brevo Email Service (Supports both SMTP & API Keys)
 */
export const sendOTPEmail = async ({ toEmail, name, otp }) => {
  const brevoApiKey = process.env.BREVO_API_KEY || "";
  const smtpUser = process.env.BREVO_SMTP_USER || "a1b95c001@smtp-brevo.com";
  const senderEmail = process.env.SENDER_EMAIL || "dineshsuwalkya31@gmail.com";
  const senderName = process.env.SENDER_NAME || "BuildPilot AI";

  const subject = `${otp} is your BuildPilot AI Verification Code`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b0d13; color: #e2e8f0; margin: 0; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #131722; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .logo { font-size: 24px; font-weight: 800; background: linear-gradient(to right, #a855f7, #6366f1, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; margin-bottom: 24px; }
        h2 { font-size: 20px; color: #ffffff; margin-bottom: 8px; text-align: center; }
        p { font-size: 14px; color: #94a3b8; line-height: 1.6; text-align: center; margin-bottom: 24px; }
        .otp-box { background: #090a0f; border: 1px solid #334155; border-radius: 12px; padding: 18px; text-align: center; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; margin: 24px 0; }
        .footer { font-size: 12px; color: #64748b; text-align: center; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🚀 BuildPilot AI</div>
        <h2>Verify Your Email</h2>
        <p>Hi ${name || "Developer"}, welcome to BuildPilot AI! Use the verification code below to complete your account setup:</p>
        <div class="otp-box">${otp}</div>
        <p>This code will expire in <strong>10 minutes</strong>. If you didn't request this email, please ignore it.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} BuildPilot AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. If key is an SMTP key (starts with "xsmtpsib-"), use direct TLS SMTP connection
  if (brevoApiKey.startsWith("xsmtpsib-")) {
    try {
      console.log(`[Brevo SMTP] Sending OTP email to ${toEmail}...`);
      const result = await sendViaSMTP({
        host: "smtp-relay.brevo.com",
        port: 465,
        user: smtpUser,
        pass: brevoApiKey,
        from: senderEmail,
        fromName: senderName,
        to: toEmail,
        subject,
        htmlContent,
      });

      console.log(`[Brevo SMTP] OTP email delivered successfully to ${toEmail}!`);
      return { success: true, method: "SMTP", result };
    } catch (err) {
      console.error("[Brevo SMTP Error]:", err.message);
    }
  }

  // 2. If key is an API Key (starts with "xkeysib-"), use Brevo v3 REST API
  if (brevoApiKey.startsWith("xkeysib-")) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: toEmail, name: name || toEmail }],
          subject,
          htmlContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("[Brevo API Error Response]:", data);
        throw new Error(data.message || "Failed to send email via Brevo API");
      }

      console.log(`[Brevo API] OTP email sent successfully to ${toEmail}. Message ID: ${data.messageId}`);
      return { success: true, method: "API", messageId: data.messageId };
    } catch (err) {
      console.error("[Brevo API Error]:", err.message);
    }
  }

  // Fallback / Development mode logging
  console.log("============================================");
  console.log(`[DEV OTP EMAIL MOCK] To: ${toEmail} | OTP Code: ${otp}`);
  console.log("Provide BREVO_API_KEY in server/.env to enable live email delivery via Brevo.");
  console.log("============================================");

  return { success: true, isMock: true };
};

export const sendPasswordResetEmail = async ({ toEmail, name, otp }) => {
  const brevoApiKey = process.env.BREVO_API_KEY || "";
  const smtpUser = process.env.BREVO_SMTP_USER || "a1b95c001@smtp-brevo.com";
  const senderEmail = process.env.SENDER_EMAIL || "dineshsuwalkya31@gmail.com";
  const senderName = process.env.SENDER_NAME || "BuildPilot AI";

  const subject = `${otp} is your BuildPilot AI Password Reset Code`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Password</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0b0d13; color: #e2e8f0; margin: 0; padding: 40px 20px; }
        .container { max-width: 500px; margin: 0 auto; background: #131722; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .logo { font-size: 24px; font-weight: 800; background: linear-gradient(to right, #a855f7, #6366f1, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-align: center; margin-bottom: 24px; }
        h2 { font-size: 20px; color: #ffffff; margin-bottom: 8px; text-align: center; }
        p { font-size: 14px; color: #94a3b8; line-height: 1.6; text-align: center; margin-bottom: 24px; }
        .otp-box { background: #090a0f; border: 1px solid #334155; border-radius: 12px; padding: 18px; text-align: center; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #f43f5e; margin: 24px 0; }
        .footer { font-size: 12px; color: #64748b; text-align: center; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🚀 BuildPilot AI</div>
        <h2>Password Reset Request</h2>
        <p>Hi ${name || "User"}, we received a request to reset your BuildPilot AI password. Use the security code below to reset your password:</p>
        <div class="otp-box">${otp}</div>
        <p>This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} BuildPilot AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  if (brevoApiKey.startsWith("xsmtpsib-")) {
    try {
      console.log(`[Brevo SMTP] Sending Password Reset email to ${toEmail}...`);
      const result = await sendViaSMTP({
        host: "smtp-relay.brevo.com",
        port: 465,
        user: smtpUser,
        pass: brevoApiKey,
        from: senderEmail,
        fromName: senderName,
        to: toEmail,
        subject,
        htmlContent,
      });

      console.log(`[Brevo SMTP] Password reset email delivered successfully to ${toEmail}!`);
      return { success: true, method: "SMTP", result };
    } catch (err) {
      console.error("[Brevo SMTP Error]:", err.message);
    }
  }

  if (brevoApiKey.startsWith("xkeysib-")) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": brevoApiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: toEmail, name: name || toEmail }],
          subject,
          htmlContent,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send email via Brevo API");

      console.log(`[Brevo API] Password reset email sent to ${toEmail}. ID: ${data.messageId}`);
      return { success: true, method: "API", messageId: data.messageId };
    } catch (err) {
      console.error("[Brevo API Error]:", err.message);
    }
  }

  console.log("============================================");
  console.log(`[DEV RESET EMAIL MOCK] To: ${toEmail} | Reset OTP: ${otp}`);
  console.log("============================================");

  return { success: true, isMock: true };
};
