import { Request, Response, NextFunction } from 'express';
export declare enum UserRole {
    ADMIN = "admin",
    OPERATOR = "operator",
    USER = "user"
}
export declare const Permissions: {
    readonly VIDEO_CREATE: "video:create";
    readonly VIDEO_UPDATE: "video:update";
    readonly VIDEO_DELETE: "video:delete";
    readonly VIDEO_READ: "video:read";
    readonly USER_CREATE: "user:create";
    readonly USER_UPDATE: "user:update";
    readonly USER_DELETE: "user:delete";
    readonly USER_READ: "user:read";
    readonly SYSTEM_CONFIG: "system:config";
    readonly SYSTEM_LOG: "system:log";
    readonly API_MANAGE: "api:manage";
    readonly API_MONITOR: "api:monitor";
};
export declare const RolePermissions: Record<UserRole, string[]>;
interface TokenPayload {
    userId: string;
    role: string;
    iat: number;
    exp: number;
}
export declare const verifyToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyApiKey: (req: Request, res: Response, next: NextFunction) => Promise<Express.Response | undefined>;
export declare const checkPermission: (requiredPermission: keyof typeof Permissions) => (req: Request, res: Response, next: NextFunction) => Promise<Express.Response | undefined>;
export declare const rateLimit: (limit: number, windowMs: number) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const ipBlacklist: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const verifySignature: (req: Request, res: Response, next: NextFunction) => Express.Response | undefined;
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
export {};
