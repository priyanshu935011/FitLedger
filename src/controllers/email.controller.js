// import { sendEmail } from "../services/email.service.js";

// export const sendPasswordSetupEmail = async (req, res) => {
//   const { email, name, token } = req.body;

//   const actionLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`;

//   await sendEmail({
//     to_email: email,
//     to_name: name,
//     subject: "Set your FitLedger password",
//     action_link: actionLink,
//   });

//   res.json({ success: true });
// };
