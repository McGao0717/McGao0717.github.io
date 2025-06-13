import { Request, Response, NextFunction } from 'express';
export declare const openAccess: (req: Request, res: Response, next: NextFunction) => void;
export declare const standardResponse: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
