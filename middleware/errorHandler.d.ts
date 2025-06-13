import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    statusCode: number;
    message: string;
    source?: string | undefined;
    raw?: any | undefined;
    constructor(statusCode: number, message: string, source?: string | undefined, raw?: any | undefined);
}
export declare const errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const handleApiError: (error: any) => AppError;
