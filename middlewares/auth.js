"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const errorHandler_1 = require("./errorHandler");
const authMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        throw new errorHandler_1.ApiError(401, 'API密钥缺失');
    }
    if (typeof apiKey !== 'string') {
        throw new errorHandler_1.ApiError(401, 'API密钥格式无效');
    }
    // TODO: 实现实际的API密钥验证逻辑
    if (apiKey !== process.env.MINTRO_API_KEY) {
        throw new errorHandler_1.ApiError(401, 'API密钥无效');
    }
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map