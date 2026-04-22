import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";
import { errorHandler } from "./middlewares/error-handle.js";
import cors from "cors";

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: '3mb' })); 
app.use(express.urlencoded({ limit: '3mb', extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", errorHandler, authRoutes);
app.use("/api/messages", errorHandler, messageRoutes);

app.use(errorHandler);

export default app;
