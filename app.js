import express from "express";
import morgan from "morgan";
import cors from "cors";
import unknownEndpoint from "./middlewares/unknownEndpoint.js";
import connectToDB from "./database/connectToDB.js";
import errorHandler from "./middlewares/errorHandler.js";
import config from "./utils/config.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import upload from "./database/multer.js";
import cookieParser from "cookie-parser";
import applyRouter from "./routes/applyRouter.js";
import jobRouter from "./routes/jobRouter.js";

const MONGODB_URL = config.MONGODB_URL;
const app = express();

connectToDB(MONGODB_URL);

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(cors());

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));
app.use(morgan(":method :url :status :body"));

// Define your routes here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", upload.single('image'),  userRouter);
app.use("/api/v1/job", upload.single("image"), jobRouter);
app.use("/api/v1/apply", upload.single("resume"), applyRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;