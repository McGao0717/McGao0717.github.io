import { Request, Response, NextFunction } from 'express';
export declare const loggerMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
