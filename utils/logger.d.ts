import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
export declare const logger: winston.Logger;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorLogger: (err: Error & {
    code?: number;
    status?: number;
}, req: Request, res: Response, next: NextFunction) => void;
export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
export declare const logUtils: {
    logApiCall: (service: string, method: string, duration: number, success: boolean, metadata?: any) => void;
    logCache: (operation: string, key: string, hit: boolean, metadata?: any) => void;
    logBusinessEvent: (event: string, metadata?: any) => void;
    logPerformance: (metric: string, value: number, metadata?: any) => void;
};
export default logger;
