import express from "express";
import cors from "cors";
import authRouter from "./routes/auth"
import aiRouter from "./routes/ai"
import { billingRouter } from "./routes/billing"
import rzpWebhookRouter from "./routes/rzpWebhookRouter"
import appsRouter from "./routes/apps";
import executionRouter from "./routes/execution";

const app = express();
app.use(cors())
app.use(express.json());

// Health-check route
app.get("/ping", (_, res) => {
  res.status(200).json({ status: "healthy", uptime: process.uptime() });
});

// Or alternative: /health
app.get("/health", (_, res) => {
  res.status(200).json({ status: "healthy", uptime: process.uptime() });
});

app.use("/rzp_webhook", rzpWebhookRouter);
app.use("/ai", aiRouter);
app.use("/auth", authRouter);
app.use("/billing", billingRouter);
app.use("/apps", appsRouter);
app.use("/execution", executionRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});