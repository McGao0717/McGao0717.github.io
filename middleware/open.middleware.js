"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.standardResponse = exports.openAccess = void 0;
const api_types_1 = require("../types/api.types");
const logger_1 = require("../utils/logger");
// 开放访问中间件 - 不进行任何验证，直接放行所有请求
const openAccess = (req, res, next) => {
    next();
};
exports.openAccess = openAccess;
// 标准响应格式中间件 - 仅格式化响应，不做验证
const standardResponse = (req, res, next) => {
    // 扩展 response 对象，添加标准化的成功响应方法
    res.success = function (data = null) {
        return this.json({
            code: 200,
            message: 'success',
            data,
            timestamp: Date.now(),
            requestId: req.header('X-Request-ID') || Date.now().toString()
        });
    };
    // 扩展 response 对象，添加标准化的错误响应方法
    res.error = function (message, code = api_types_1.ApiErrorCode.SYSTEM_ERROR) {
        return this.json({
            code,
            message,
            timestamp: Date.now(),
            requestId: req.header('X-Request-ID') || Date.now().toString()
        });
    };
    next();
};
exports.standardResponse = standardResponse;
// 错误处理中间件 - 捕获并格式化所有错误
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('请求处理错误:', err);
    return res.status(500).json({
        code: api_types_1.ApiErrorCode.SYSTEM_ERROR,
        message: '系统错误',
        timestamp: Date.now(),
        requestId: req.header('X-Request-ID') || Date.now().toString()
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=open.middleware.js.map