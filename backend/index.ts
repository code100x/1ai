import express from "express";
import cors from "cors";
import authRouter from "./routes/auth";
import aiRouter from "./routes/ai";
import paymentRouter from "./routes/payment";

const app = express();
app.use(cors());

app.use(express.json());
app.use("/ai", aiRouter);
app.use("/auth", authRouter);
app.use("/payment", paymentRouter);

app.listen(3000);
