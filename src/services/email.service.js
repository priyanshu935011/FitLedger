import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordSetupEmail = async ({
  to_email,
  to_name,
  action_link,
}) => {
  console.log("📨 Attempting to send email via Resend");
  console.log("To:", to_email);
  console.log("Action link:", action_link);
  console.log("API key exists:", !!process.env.RESEND_API_KEY);

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: to_email,
    subject: "Set your FitLedger password",
    html: `<a href="${action_link}">Set Password</a>`,
  });

  console.log("✅ Resend response:", result);
  return result;
};
