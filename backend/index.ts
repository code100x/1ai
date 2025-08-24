import express from "express";
import cors from "cors";
import authRouter from "./routes/auth"
import aiRouter from "./routes/ai"
import { billingRouter } from "./routes/billing"
import rzpWebhookRouter from "./routes/rzpWebhookRouter"
import appsRouter from "./routes/apps";
import executionRouter from "./routes/execution";
import { specs, swaggerUi, swaggerOptions } from "./swagger";

const app = express();
app.use(cors())

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to 1AI API",
        version: "1.0.0",
        documentation: "/api-docs",
        endpoints: {
            auth: "/auth",
            ai: "/ai", 
            billing: "/billing",
            apps: "/apps",
            execution: "/execution"
        }
    });
});

app.use("/rzp_webhook", rzpWebhookRouter);
app.use("/ai", aiRouter);
app.use("/auth", authRouter);
app.use("/billing", billingRouter);
app.use("/apps", appsRouter);
app.use("/execution", executionRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
    console.log("API Documentation available at: http://localhost:3000/api-docs");
});