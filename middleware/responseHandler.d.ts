import { Request, Response, NextFunction } from 'express';
export declare const responseHandler: (req: Request, res: Response, next: NextFunction) => void;
declare global {
    namespace Express {
        interface Response {
            success<T>(data: T, message?: string): Response;
            error(message: string, statusCode?: number): Response;
        }
    }
}
