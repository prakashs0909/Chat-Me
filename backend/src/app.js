import express from "express";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";
import { errorHandler } from "./middlewares/error-handle.js";
import cors from "cors";
const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ limit: "3mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(passport.initialize());

// app.use((req, res, next) => {
//   console.log("Incoming:", req.method, req.url);
//   next();
// });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(errorHandler);
export default app;
