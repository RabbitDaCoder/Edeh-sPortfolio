import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "../config/redis";

function createStore(prefix: string) {
  return new RedisStore({
    sendCommand: (...args: string[]) =>
      redis.call(args[0], ...args.slice(1)) as any,
    prefix,
  });
}

export const generalLimiter = rateLimit({
  store: createStore("rl:general:"),
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === "127.0.0.1",
});

export const authLimiter = rateLimit({
  store: createStore("rl:auth:"),
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === "127.0.0.1",
});

export const contactLimiter = rateLimit({
  store: createStore("rl:contact:"),
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many contact submissions, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === "127.0.0.1",
});
