import { Response } from "express";
import { ErrorCode, ErrorMessages, StatusCodeMap } from "./errorCodes";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
  };
}

export function success<T>(
  res: Response,
  data: T,
  statusCode: number = 200,
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
  } as ApiResponse<T>);
}

export function error(
  res: Response,
  code: ErrorCode,
  message?: string,
  statusCode?: number,
): Response {
  const finalMessage = message || ErrorMessages[code];
  const finalStatusCode = statusCode || StatusCodeMap[code] || 500;

  return res.status(finalStatusCode).json({
    success: false,
    error: {
      code,
      message: finalMessage,
    },
  } as ApiResponse);
}
