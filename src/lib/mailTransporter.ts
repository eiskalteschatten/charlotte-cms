import nodemailer from 'nodemailer';

export default nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  ...process.env.EMAIL_USER && process.env.EMAIL_PASSWORD ? {
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  } : {},
  tls: {
    rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED === 'true',
  },
});
