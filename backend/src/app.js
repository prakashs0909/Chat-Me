import express from "express";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth-routes.js";
import messageRoutes from "./routes/message-routes.js";
import { errorHandler } from "./middlewares/error-handle.js";
import { ENV_VAR } from "./config/env-var.js";
import cors from "cors";
import path from "path";

const app = express();

const __dirname = path.resolve();

app.use(cookieParser());
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ limit: "3mb", extended: true }));
app.use(
  cors({
    origin: ENV_VAR.CLIENT_URL,
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


if(ENV_VAR.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
  app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}

app.use(errorHandler);

export default app;