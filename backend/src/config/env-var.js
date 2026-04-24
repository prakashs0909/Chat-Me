import dotenv from "dotenv";
dotenv.config({ quiet: true });

export const ENV_VAR = {
  PORT: process.env.PORT,
  CLIENT_URL: process.env.CLIENT_URL,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
};

export const CLOUDINARY = {
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
}

export const NODEMAILER = {
  PASS: process.env.NODEMAILER_PASS,
  EMAIL: process.env.NODEMAILER_EMAIL,
  SERVICE: process.env.NODEMAILER_SERVICE,
  SECURE: process.env.NODEMAILER_SECURE,
  PORT: process.env.NODEMAILER_PORT,
}