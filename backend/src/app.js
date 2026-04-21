import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";
import { errorHandler } from "./middlewares/error-handle.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", errorHandler, authRoutes);
app.use("/api/message", errorHandler, messageRoutes);

app.use(errorHandler);

export default app;