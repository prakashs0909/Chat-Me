import nodemailer from 'nodemailer';
import { NODEMAILER } from './env-var.js';
 const transporter = nodemailer.createTransport({
    service: NODEMAILER.SERVICE,
    secure: NODEMAILER.SECURE,
    port:NODEMAILER.PORT,
    auth: {
        user: NODEMAILER.EMAIL,
        pass: NODEMAILER.PASS
    }
});         

export default transporter;