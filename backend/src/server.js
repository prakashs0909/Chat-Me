import { connectDB } from "./config/db-config.js";
import { ENV_VAR } from "./config/env-var.js";
import app from "./app.js";

connectDB()
  .then(() => {
    app.listen(ENV_VAR.PORT, (error) => {
      if (error) {
        console.log("Error starting server:", error);
        return;
      }
      console.log(`Server is running on port ${ENV_VAR.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to the database:", error);
  });
