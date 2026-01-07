import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true only for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordSetupEmail = async ({
  to_email,
  to_name,
  action_link,
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to_email,
    subject: "Set your FitLedger password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px;">
        <h2>Welcome to FitLedger</h2>
        <p>Hi ${to_name},</p>
        <p>Your account has been created.</p>
        <p>
          <a href="${action_link}"
             style="display:inline-block;padding:12px 18px;
                    background:#2563eb;color:#fff;
                    text-decoration:none;border-radius:6px;">
            Set your password
          </a>
        </p>
        <p style="font-size:12px;color:#666;">
          This link will expire for security reasons.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
