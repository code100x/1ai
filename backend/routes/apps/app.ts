import type { Request, Response } from "express";
import type { ZodSchema } from "zod";

export enum AppType {
    HttpLLM = "http-llm",
    StreamableLLM = "streamable-llm"
}

export abstract class App {
    private name: string;
    private route: string;
    private description: string;
    private icon: string;
    private per_execution_credit: number;
    public zodSchema: ZodSchema;
    private appType: AppType;

    constructor({ name, route, description, icon, per_execution_credit, zodSchema, appType }:
        { name: string, route: string, description: string, icon: string, per_execution_credit: number, zodSchema: ZodSchema, appType: AppType }) {
        this.name = name;
        this.route = route;
        this.description = description;
        this.icon = icon;
        this.per_execution_credit = per_execution_credit;
        this.zodSchema = zodSchema;
        this.appType = appType;
        if (this.appType === AppType.HttpLLM) {
            this.initHTTPRoute();
        }
        if (this.appType === AppType.StreamableLLM) {
            this.initStreamableRoute();
        }
    }

    initStreamableRoute() {
        return (req: Request, res: Response) => {
            const result = this.zodSchema.safeParse(req.body);

            if (!result.success) {
                res.status(400).json({ error: result.error.message });
                return;
            }

            this.runStreamable(result.data as unknown as ZodSchema, (chunk) => {
                res.write(chunk);
            });
        }
    }

    initHTTPRoute() {
        return (req: Request, res: Response) => {
            const result = this.zodSchema.safeParse(req.body);

            if (!result.success) {
                res.status(400).json({ error: result.error.message });
                return;
            }

            const response = this.run(result.data as unknown as ZodSchema);
            res.json({
                response
            })
        }
    }


    runStreamable(data: any, callback: (chunk: string) => void) {
        throw new Error("Not implemented");
    }

    run(data: any) {
        throw new Error("Not implemented");
    }

}