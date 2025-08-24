import jwt from "jsonwebtoken";
import { PrismaClient } from "./generated/prisma";
import crypto from "crypto";

const prisma = new PrismaClient();

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

interface RefreshTokenPayload {
    userId: string;
    tokenId: string;
    type: "refresh";
}

export class AuthTokenManager {
    private static instance: AuthTokenManager;

    static getInstance(): AuthTokenManager {
        if (!AuthTokenManager.instance) {
            AuthTokenManager.instance = new AuthTokenManager();
        }
        return AuthTokenManager.instance;
    }

    async generateTokenPair(userId: string): Promise<TokenPair> {
        const tokenId = crypto.randomUUID();
        
        const accessToken = jwt.sign(
            { userId, type: "access" },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { userId, tokenId, type: "refresh" },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" }
        );

        await prisma.refreshToken.create({
            data: {
                id: tokenId,
                userId,
                token: refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return { accessToken, refreshToken };
    }

    async refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as RefreshTokenPayload;
            
            const storedToken = await prisma.refreshToken.findUnique({
                where: { id: decoded.tokenId }
            });

            if (!storedToken || storedToken.token !== refreshToken || storedToken.expiresAt < new Date()) {
                return null;
            }

            await prisma.refreshToken.delete({
                where: { id: decoded.tokenId }
            });

            return await this.generateTokenPair(decoded.userId);
        } catch {
            return null;
        }
    }

    async revokeRefreshToken(tokenId: string): Promise<void> {
        await prisma.refreshToken.delete({
            where: { id: tokenId }
        });
    }

    async revokeAllUserTokens(userId: string): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }

    verifyAccessToken(token: string): { userId: string } | null {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            return decoded.type === "access" ? { userId: decoded.userId } : null;
        } catch {
            return null;
        }
    }
}
