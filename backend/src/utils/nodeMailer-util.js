import transporter from "../config/nodeMailer-config.js";
import { NODEMAILER } from "../config/env-var.js";

export const sendVerificationLink = async (to, message, next) => {
  try {
    return await transporter.sendMail({
      from: NODEMAILER.EMAIL,
      to,
      subject: "Email for Account Verification",
      text: "please don't reply to this email, this is an auto generated email for account verification",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #007BFF;">Verify Your Account</h2>
        <p>Click the button below to verify your account and get started:</p>
        <a href="${message}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Verify Account</a>
        <p>If you did not create an account, please ignore this email.</p>
        </div>`,
    });
    // console.log(result);
  } catch (error) {
    next(error);
  }
};
