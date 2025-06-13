"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = exports.ipBlacklist = exports.rateLimit = exports.checkPermission = exports.verifyApiKey = exports.verifyToken = exports.RolePermissions = exports.Permissions = exports.UserRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_types_1 = require("../types/api.types");
const logger_1 = require("../utils/logger");
const redis_1 = require("../config/redis");
const config_1 = __importDefault(require("../config"));
// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
// 用户角色枚举
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["OPERATOR"] = "operator";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
// 权限定义
exports.Permissions = {
    // 视频管理权限
    VIDEO_CREATE: 'video:create',
    VIDEO_UPDATE: 'video:update',
    VIDEO_DELETE: 'video:delete',
    VIDEO_READ: 'video:read',
    // 用户管理权限
    USER_CREATE: 'user:create',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',
    USER_READ: 'user:read',
    // 系统管理权限
    SYSTEM_CONFIG: 'system:config',
    SYSTEM_LOG: 'system:log',
    // API管理权限
    API_MANAGE: 'api:manage',
    API_MONITOR: 'api:monitor'
};
// 角色权限映射
exports.RolePermissions = {
    [UserRole.ADMIN]: Object.values(exports.Permissions),
    [UserRole.OPERATOR]: [
        exports.Permissions.VIDEO_READ,
        exports.Permissions.VIDEO_UPDATE,
        exports.Permissions.USER_READ,
        exports.Permissions.API_MONITOR
    ],
    [UserRole.USER]: [
        exports.Permissions.VIDEO_READ,
        exports.Permissions.USER_READ
    ]
};
// 请求速率限制的Map
const requests = new Map();
// 清理过期的请求记录
setInterval(() => {
    const now = Date.now();
    for (const [key, timestamps] of requests.entries()) {
        const validTimestamps = timestamps.filter(time => now - time < 60000);
        if (validTimestamps.length === 0) {
            requests.delete(key);
        }
        else {
            requests.set(key, validTimestamps);
        }
    }
}, 60000);
// JWT验证中间件
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.security.jwtSecret);
        // 检查令牌是否被吊销
        const isRevoked = await redis_1.redis.sismember('revoked_tokens', token);
        if (isRevoked) {
            return res.status(401).json({ error: 'Token has been revoked' });
        }
        // 将用户信息添加到请求对象
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.logger.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.verifyToken = verifyToken;
// API密钥验证中间件
const verifyApiKey = async (req, res, next) => {
    try {
        const apiKey = req.header('X-API-Key');
        if (!apiKey) {
            return res.error('未提供API密钥', api_types_1.ApiErrorCode.UNAUTHORIZED);
        }
        // 从Redis获取API密钥信息
        const apiKeyInfo = await redis_1.redis.hgetall(`api_key:${apiKey}`);
        if (!apiKeyInfo || !Object.keys(apiKeyInfo).length) {
            return res.error('无效的API密钥', api_types_1.ApiErrorCode.API_KEY_INVALID);
        }
        // 检查API密钥是否过期
        if (apiKeyInfo.expires && Date.now() > apiKeyInfo.expires) {
            return res.error('API密钥已过期', api_types_1.ApiErrorCode.API_KEY_EXPIRED);
        }
        // 检查API密钥是否被禁用
        if (apiKeyInfo.disabled) {
            return res.error('API密钥已被禁用', api_types_1.ApiErrorCode.API_KEY_INVALID);
        }
        // 将API密钥信息添加到请求对象
        req.apiKey = apiKeyInfo;
        next();
    }
    catch (error) {
        logger_1.logger.error('API密钥验证失败:', error);
        return res.error('API密钥验证失败', api_types_1.ApiErrorCode.API_KEY_INVALID);
    }
};
exports.verifyApiKey = verifyApiKey;
// 权限检查中间件
const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.error('未授权访问', api_types_1.ApiErrorCode.UNAUTHORIZED);
            }
            const userRole = req.user.role;
            const permissions = exports.RolePermissions[userRole];
            if (!permissions.includes(exports.Permissions[requiredPermission])) {
                logger_1.logger.warn('权限检查失败', {
                    userId: req.user.userId,
                    requiredPermission,
                    userRole,
                    userPermissions: permissions
                });
                return res.error('权限不足', api_types_1.ApiErrorCode.PERMISSION_DENIED);
            }
            next();
        }
        catch (error) {
            logger_1.logger.error('权限检查失败:', error);
            return res.error('权限检查失败', api_types_1.ApiErrorCode.SYSTEM_ERROR);
        }
    };
};
exports.checkPermission = checkPermission;
// 速率限制中间件
const rateLimit = (limit, windowMs) => {
    return async (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        const key = `${ip}:${req.path}`;
        // 获取该IP的请求记录
        const timestamps = requests.get(key) || [];
        // 清理过期的请求记录
        const validTimestamps = timestamps.filter(time => now - time < windowMs);
        if (validTimestamps.length >= limit) {
            logger_1.logger.warn('请求频率超限', {
                ip: ip,
                requestCount: validTimestamps.length,
                limit,
                windowMs
            });
            return res.status(429).json({ error: 'Too many requests' });
        }
        // 添加新的请求记录
        validTimestamps.push(now);
        requests.set(key, validTimestamps);
        next();
    };
};
exports.rateLimit = rateLimit;
// IP黑名单中间件
const ipBlacklist = async (req, res, next) => {
    try {
        const ip = req.ip || '';
        if (!ip) {
            logger_1.logger.warn('Unable to determine client IP address');
            return next();
        }
        const isBlocked = await redis_1.redis.sismember('ip_blacklist', ip);
        if (isBlocked) {
            logger_1.logger.warn(`Blocked request from blacklisted IP: ${ip}`);
            return res.status(403).json({ error: 'IP address is blocked' });
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('Error checking IP blacklist:', error);
        next(error);
    }
};
exports.ipBlacklist = ipBlacklist;
// 签名计算函数
const calculateSignature = (data, timestamp, nonce) => {
    const message = JSON.stringify(data) + timestamp + nonce + process.env.API_SECRET;
    return require('crypto')
        .createHash('sha256')
        .update(message)
        .digest('hex');
};
// 请求签名验证中间件
const verifySignature = (req, res, next) => {
    try {
        const signature = req.header('X-Signature') || '';
        const timestamp = req.header('X-Timestamp') || '';
        const nonce = req.header('X-Nonce') || '';
        if (!signature || !timestamp || !nonce) {
            return res.error('缺少签名参数', api_types_1.ApiErrorCode.INVALID_SIGNATURE);
        }
        // 检查时间戳是否在有效期内（5分钟）
        const timestampNum = parseInt(timestamp, 10);
        if (isNaN(timestampNum) || Date.now() - timestampNum > 5 * 60 * 1000) {
            return res.error('请求已过期', api_types_1.ApiErrorCode.INVALID_SIGNATURE);
        }
        // 验证签名
        const calculatedSignature = calculateSignature(req.body, timestamp, nonce);
        if (signature !== calculatedSignature) {
            logger_1.logger.warn('签名验证失败', {
                providedSignature: signature,
                calculatedSignature,
                timestamp,
                nonce
            });
            return res.error('无效的签名', api_types_1.ApiErrorCode.INVALID_SIGNATURE);
        }
        next();
    }
    catch (error) {
        logger_1.logger.error('签名验证失败:', error);
        return res.error('签名验证失败', api_types_1.ApiErrorCode.INVALID_SIGNATURE);
    }
};
exports.verifySignature = verifySignature;
//# sourceMappingURL=auth.middleware.js.map