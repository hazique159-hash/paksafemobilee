import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTPEmail(email: string, otp: string, name: string) {
  const mailOptions = {
    from: `"PakSafeMobiles" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: "Verify Your Email - PakSafeMobiles",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
        <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <div style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 100%);padding:32px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:8px;">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style="color:#ffffff;font-size:24px;font-weight:700;">PakSafeMobiles</span>
            </div>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#1e1b4b;margin:0 0 8px 0;font-size:22px;">Verify Your Email</h2>
            <p style="color:#64748b;margin:0 0 24px 0;font-size:15px;">Hi ${name}, use this OTP to verify your email address:</p>
            <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
              <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#1e1b4b;">${otp}</span>
            </div>
            <p style="color:#94a3b8;font-size:13px;margin:0;text-align:center;">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          </div>
          <div style="background:#f8fafc;padding:16px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="color:#94a3b8;font-size:12px;margin:0;">© 2024 PakSafeMobiles. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}
