import express from "express";
import cors from "cors";
import authRouter from "./routes/auth"
import aiRouter from "./routes/ai"
import { billingRouter } from "./routes/billing"
import { MetricsCollector } from "./metrics";

const app = express();
const metrics = MetricsCollector.getInstance();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(metrics.middleware());

app.get("/health", async (req, res) => {
    const health = await metrics.getHealthStatus();
    res.status(health.status === "healthy" ? 200 : 503).json(health);
});

app.get("/metrics", async (req, res) => {
    const [systemMetrics, userMetrics] = await Promise.all([
        metrics.getSystemMetrics(),
        metrics.getUserMetrics()
    ]);
    res.json({ system: systemMetrics, users: userMetrics });
});

app.use("/ai", aiRouter);
app.use("/auth", authRouter);
app.use("/billing", billingRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});