import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
export declare const loggerMiddleware: (logger: winston.Logger) => (req: Request, res: Response, next: NextFunction) => void;
