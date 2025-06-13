import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
export declare class ApiError extends Error {
    statusCode: number;
    details?: any | undefined;
    constructor(statusCode: number, message: string, details?: any | undefined);
}
export declare const errorHandler: (logger: winston.Logger) => (error: Error, req: Request, res: Response, next: NextFunction) => void;
