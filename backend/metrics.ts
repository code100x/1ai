import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

interface SystemMetrics {
    uptime: number;
    memory: NodeJS.MemoryUsage;
    activeConnections: number;
    totalRequests: number;
    errorRate: number;
    avgResponseTime: number;
}

interface UserMetrics {
    totalUsers: number;
    activeUsers: number;
    premiumUsers: number;
    totalCreditsUsed: number;
    totalConversations: number;
    totalMessages: number;
}

export class MetricsCollector {
    private static instance: MetricsCollector;
    private requestCount = 0;
    private errorCount = 0;
    private responseTimes: number[] = [];
    private activeConnections = 0;
    private startTime = Date.now();

    static getInstance(): MetricsCollector {
        if (!MetricsCollector.instance) {
            MetricsCollector.instance = new MetricsCollector();
        }
        return MetricsCollector.instance;
    }

    middleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            const start = Date.now();
            this.requestCount++;
            this.activeConnections++;

            res.on('finish', () => {
                this.activeConnections--;
                const duration = Date.now() - start;
                this.responseTimes.push(duration);
                
                if (this.responseTimes.length > 1000) {
                    this.responseTimes = this.responseTimes.slice(-500);
                }

                if (res.statusCode >= 400) {
                    this.errorCount++;
                }
            });

            next();
        };
    }

    async getSystemMetrics(): Promise<SystemMetrics> {
        const avgResponseTime = this.responseTimes.length > 0 
            ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
            : 0;

        return {
            uptime: Date.now() - this.startTime,
            memory: process.memoryUsage(),
            activeConnections: this.activeConnections,
            totalRequests: this.requestCount,
            errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
            avgResponseTime
        };
    }

    async getUserMetrics(): Promise<UserMetrics> {
        const [
            totalUsers,
            activeUsers,
            premiumUsers,
            totalConversations,
            totalMessages
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: {
                    updatedAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            }),
            prisma.user.count({
                where: { isPremium: true }
            }),
            prisma.conversation.count(),
            prisma.message.count()
        ]);

        const creditStats = await prisma.user.aggregate({
            _sum: { credits: true }
        });

        return {
            totalUsers,
            activeUsers,
            premiumUsers,
            totalCreditsUsed: creditStats._sum.credits || 0,
            totalConversations,
            totalMessages
        };
    }

    async getHealthStatus() {
        try {
            await prisma.$queryRaw`SELECT 1`;
            const memory = process.memoryUsage();
            const memoryUsagePercent = (memory.heapUsed / memory.heapTotal) * 100;

            return {
                status: memoryUsagePercent > 90 ? "degraded" : "healthy",
                database: "connected",
                memory: {
                    usage: memoryUsagePercent,
                    heap: memory.heapUsed,
                    total: memory.heapTotal
                },
                uptime: Date.now() - this.startTime,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                status: "unhealthy",
                database: "disconnected",
                error: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString()
            };
        }
    }
}
