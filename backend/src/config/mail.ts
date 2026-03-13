import nodemailer from "nodemailer";
import { env } from "./env";

export const mailTransporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function verifyMailTransporter(): Promise<void> {
  try {
    await mailTransporter.verify();
    console.log("Mail transporter verified");
  } catch (error) {
    console.error("Mail transporter verification failed:", error);
    throw error;
  }
}
