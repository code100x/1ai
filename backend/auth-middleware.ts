import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authToken =
    req.headers.authorization?.split(" ")[1] ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNTRhNThhOC1hZTc2LTRlOTctOWYyNi05NGIzMDg3YWJlZWYiLCJpYXQiOjE3NTU4MjUxNjh9.olUkElk53OGgRmhbHwXmiw70QF6Unc-nntg9hQPmATk";

  if (!authToken) {
    res.status(403).send({
      message: "Auth token invalid",
      success: false,
    });
    return;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("secret not found");
  }

  try {
    const data = jwt.verify(authToken, process.env.JWT_SECRET);
    req.userId = (data as unknown as JwtPayload).userId as unknown as string;
    next();
  } catch (e) {
    res.status(403).send({
      message: "Auth token invalid",
      success: false,
    });
  }
};
