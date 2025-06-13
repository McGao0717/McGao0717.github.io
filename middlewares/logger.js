"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const loggerMiddleware = (logger) => {
    return (req, res, next) => {
        const start = Date.now();
        // 记录请求开始
        logger.info('请求开始', {
            method: req.method,
            path: req.path,
            query: req.query,
            headers: req.headers,
            body: req.body
        });
        // 拦截响应完成事件
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info('请求完成', {
                method: req.method,
                path: req.path,
                statusCode: res.statusCode,
                duration: `${duration}ms`
            });
        });
        next();
    };
};
exports.loggerMiddleware = loggerMiddleware;
//# sourceMappingURL=logger.js.map