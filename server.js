"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const ImageController_1 = require("./controllers/ImageController");
const WebController_1 = require("./controllers/WebController");
const middlewares_1 = require("./middlewares");
const responseHandler_1 = require("./middleware/responseHandler");
const MintroAIService_1 = require("./services/MintroAIService");
// 加载环境变量
dotenv_1.default.config();
// 创建 Express 应用
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// 创建 MintroAI 服务实例
const mintroAI = new MintroAIService_1.MintroAIService();
// 中间件
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(middlewares_1.loggerMiddleware);
app.use(middlewares_1.authMiddleware);
app.use(responseHandler_1.responseHandler);
// 初始化控制器
const imageController = new ImageController_1.ImageController(mintroAI);
const webController = new WebController_1.WebController(mintroAI);
// 路由
app.use('/api/image', imageController.router);
app.use('/api/web', webController.router);
// 错误处理
app.use(middlewares_1.errorHandler);
// 启动服务器
app.listen(port, async () => {
    try {
        // 初始化 MintroAI 服务
        await mintroAI.initialize();
        console.log(`Server is running on port ${port}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    }
    catch (error) {
        console.error('Failed to initialize services:', error);
        process.exit(1);
    }
});
// 优雅关闭
process.on('SIGTERM', async () => {
    try {
        await mintroAI.shutdown();
        process.exit(0);
    }
    catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});
//# sourceMappingURL=server.js.map