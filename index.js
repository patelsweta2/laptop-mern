import express from "express";
import dotenv from "dotenv";
import path from "path";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import connectDB from "./server/config/db.js";
import globalErrorHandler from "./server/middleware/globalErrorHandler.js";
import userRouter from "./server/router/userRoutes.js";
import laptopRouter from "./server/router/laptopRoute.js";
import assignRouter from "./server/router/assignRouter.js";
import issuesRouter from "./server/router/issuesRouter.js";
import maintenanceRouter from "./server/router/maintenanceRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// Setup security headers
app.use(helmet());
app.use(cookieParser());

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Santize data
app.use(mongoSanitize()); //nosql injection atack
// prevent Parameter pollution
app.use(hpp());

//endpoints
app.use("/api/users", userRouter);
app.use("/api/laptops", laptopRouter);
app.use("/api/assign", assignRouter);
app.use("/api/issues", issuesRouter);
app.use("/api/maintenance", maintenanceRouter);

const PORT = process.env.PORT || 5000;
const MODE = process.env.NODE_ENV || "production";

//global error handler
// app.use(globalErrorHandler);
app.get("/", (req, res) => {
  res.send("Server is running");
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connection to db successfull");
    console.log("");
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT} in ${MODE} mode.`);
    });
  } catch (error) {
    console.log(error);
    console.log("Aborting server due to error in connection to data base");
  }
};

start();
