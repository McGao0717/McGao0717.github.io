import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
export declare const validateRequest: (schema: Schema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateSignature: (secretKey: string) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateTimestamp: (maxAge?: number) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
