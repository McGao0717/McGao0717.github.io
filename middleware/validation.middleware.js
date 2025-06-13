"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTimestamp = exports.validateSignature = exports.validateRequest = void 0;
const api_types_1 = require("../types/api.types");
const auth_1 = require("../utils/auth");
const logger_1 = require("../utils/logger");
// 请求参数验证中间件
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const { error } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true
            });
            if (error) {
                return res.status(400).json({
                    code: api_types_1.ApiErrorCode.VALIDATION_FAILED,
                    message: '请求参数验证失败',
                    errors: error.details.map(detail => detail.message),
                    timestamp: Date.now(),
                    requestId: req.header('X-Request-ID') || ''
                });
            }
            next();
        }
        catch (error) {
            logger_1.logger.error('参数验证失败:', error);
            return res.status(500).json({
                code: api_types_1.ApiErrorCode.SYSTEM_ERROR,
                message: '系统错误',
                timestamp: Date.now(),
                requestId: req.header('X-Request-ID') || ''
            });
        }
    };
};
exports.validateRequest = validateRequest;
// 签名验证中间件
const validateSignature = (secretKey) => {
    return (req, res, next) => {
        try {
            const signature = req.header('X-Signature');
            if (!signature) {
                return res.status(400).json({
                    code: api_types_1.ApiErrorCode.INVALID_SIGNATURE,
                    message: '缺少签名',
                    timestamp: Date.now(),
                    requestId: req.header('X-Request-ID') || ''
                });
            }
            // 获取需要签名的参数
            const params = {
                ...req.query,
                ...req.body,
                timestamp: req.header('X-Timestamp')
            };
            // 验证签名
            if (!(0, auth_1.verifySignature)(params, signature, secretKey)) {
                return res.status(400).json({
                    code: api_types_1.ApiErrorCode.INVALID_SIGNATURE,
                    message: '无效的签名',
                    timestamp: Date.now(),
                    requestId: req.header('X-Request-ID') || ''
                });
            }
            next();
        }
        catch (error) {
            logger_1.logger.error('签名验证失败:', error);
            return res.status(500).json({
                code: api_types_1.ApiErrorCode.SYSTEM_ERROR,
                message: '系统错误',
                timestamp: Date.now(),
                requestId: req.header('X-Request-ID') || ''
            });
        }
    };
};
exports.validateSignature = validateSignature;
// 请求时间戳验证中间件
const validateTimestamp = (maxAge = 300000) => {
    return (req, res, next) => {
        try {
            const timestamp = parseInt(req.header('X-Timestamp') || '0', 10);
            const now = Date.now();
            if (!timestamp) {
                return res.status(400).json({
                    code: api_types_1.ApiErrorCode.INVALID_PARAMS,
                    message: '缺少时间戳',
                    timestamp: now,
                    requestId: req.header('X-Request-ID') || ''
                });
            }
            if (Math.abs(now - timestamp) > maxAge) {
                return res.status(400).json({
                    code: api_types_1.ApiErrorCode.INVALID_PARAMS,
                    message: '请求已过期',
                    timestamp: now,
                    requestId: req.header('X-Request-ID') || ''
                });
            }
            next();
        }
        catch (error) {
            logger_1.logger.error('时间戳验证失败:', error);
            return res.status(500).json({
                code: api_types_1.ApiErrorCode.SYSTEM_ERROR,
                message: '系统错误',
                timestamp: Date.now(),
                requestId: req.header('X-Request-ID') || ''
            });
        }
    };
};
exports.validateTimestamp = validateTimestamp;
//# sourceMappingURL=validation.middleware.js.map