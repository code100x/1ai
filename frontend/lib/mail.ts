import nodemailer from "nodemailer";
import { env } from "@/env";

export const user: string = env.MAIL_APP_USER!;

const app_password: string = env.MAIL_APP_PASSWORD!;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smt.gamil.com",
  port: 587,
  secure: false,
  auth: {
    user: user,
    pass: app_password,
  },
});