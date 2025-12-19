import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/configDB.js";
import userRouter from "./routes/userRoute.js";
import livreRouter from "./routes/livreRoute.js";
import loanRouter from "./routes/loanRoute.js";
const app = express();
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api/user", userRouter);
app.use("/api/livre", livreRouter);
app.use("/api/loan", loanRouter);
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});