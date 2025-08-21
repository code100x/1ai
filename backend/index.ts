import express from "express";
import cors from "cors";
import authRouter from "./routes/auth"
import aiRouter from "./routes/ai"
import { billingRouter } from "./routes/billing"

const app = express();
app.use(cors())

app.use(express.json());
app.use("/ai", aiRouter);
app.use("/auth", authRouter);
app.use("/billing", billingRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});