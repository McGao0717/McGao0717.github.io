"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintroAIService = void 0;
const events_1 = require("events");
const logger_1 = require("../utils/logger");
const axios_1 = __importStar(require("axios"));
const NLPService_1 = __importDefault(require("./nlp/NLPService"));
const CVService_1 = __importDefault(require("./cv/CVService"));
const DataService_1 = __importDefault(require("./data/DataService"));
const mysql_service_1 = require("./mysql.service");
const database_1 = __importDefault(require("../config/database"));
const path_1 = __importDefault(require("path"));
class MintroAIService extends events_1.EventEmitter {
    constructor(partialConfig = {}) {
        super();
        this.logger = logger_1.logger;
        const defaultConfig = {
            apiKey: process.env.MINTRO_API_KEY || 'default-key',
            apiBaseUrl: process.env.MINTRO_API_BASE_URL || 'https://api.mintro.ai',
            modelVersion: process.env.MINTRO_MODEL_VERSION || 'v1',
            maxRetries: parseInt(process.env.MINTRO_MAX_RETRIES || '3'),
            timeout: parseInt(process.env.MINTRO_TIMEOUT || '30000'),
            debug: process.env.DEBUG === 'true',
            logLevel: process.env.LOG_LEVEL || 'info',
            mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
            redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
            uploadDir: process.env.UPLOAD_DIR || path_1.default.join(process.cwd(), 'uploads')
        };
        this.config = { ...defaultConfig, ...partialConfig };
        this.nlpService = new NLPService_1.default(this.config);
        this.cvService = new CVService_1.default(this.config);
        this.dataService = new DataService_1.default(this.config);
        this.dbService = new mysql_service_1.MySQLService(database_1.default);
        logger_1.logger.info('MintroAIService initialized with config:', this.config);
    }
    /**
     * 初始化服务
     */
    async initialize() {
        try {
            // 初始化各个服务
            await Promise.all([
                this.cvService.initialize(),
                this.dataService.initialize()
            ]);
            this.emit('services:initialized');
            logger_1.logger.info('All services initialized successfully');
        }
        catch (error) {
            this.emit('services:error', error);
            throw new Error(`服务初始化失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 处理文本
     */
    async processText(text) {
        try {
            logger_1.logger.info('Processing text...');
            // 文本处理逻辑
            return { status: 'success', message: 'Text processed' };
        }
        catch (error) {
            logger_1.logger.error('Text processing failed:', error);
            throw error;
        }
    }
    /**
     * 处理图像
     */
    async processImage(imageData) {
        try {
            logger_1.logger.info('Processing image...');
            let processedData;
            // If imageData is a string, assume it's a file path and resolve it
            if (typeof imageData === 'string') {
                const imagePath = path_1.default.isAbsolute(imageData) ?
                    imageData :
                    path_1.default.join(this.config.uploadDir, imageData);
                processedData = await this.dataService.readFile(imagePath);
            }
            else {
                processedData = imageData;
            }
            const result = await this.cvService.processImage(processedData);
            return { success: true, data: result };
        }
        catch (error) {
            logger_1.logger.error('Image processing failed:', error);
            throw new Error(`图像处理失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 生成文本
     */
    async generateText(prompt, options = {}) {
        try {
            // 添加到任务队列
            const task = await this.dataService.addTask('text_generation', {
                prompt,
                options
            });
            // 生成文本
            const result = await this.nlpService.generateText(prompt, options);
            // 更新任务状态
            await task.update({ result });
            return result;
        }
        catch (error) {
            throw new Error(`文本生成失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 问答系统
     */
    async answerQuestion(context, question) {
        try {
            const cacheKey = `qa:${question}:${context.substring(0, 100)}`;
            // 检查缓存
            const cachedResult = await this.dataService.getCachedData(cacheKey);
            if (cachedResult) {
                return cachedResult;
            }
            // 生成答案
            const result = await this.nlpService.answerQuestion(context, question);
            // 缓存结果
            await this.dataService.cacheData(cacheKey, result, 3600);
            return result;
        }
        catch (error) {
            throw new Error(`问答处理失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 处理视频
     */
    async processVideo(videoData) {
        try {
            logger_1.logger.info('Processing video...');
            let processedData;
            // If videoData is a string, assume it's a file path and resolve it
            if (typeof videoData === 'string') {
                const videoPath = path_1.default.isAbsolute(videoData) ?
                    videoData :
                    path_1.default.join(this.config.uploadDir, videoData);
                processedData = await this.dataService.readFile(videoPath);
            }
            else {
                processedData = videoData;
            }
            // 视频处理逻辑
            return { status: 'success', message: 'Video processed' };
        }
        catch (error) {
            logger_1.logger.error('Video processing failed:', error);
            throw new Error(`视频处理失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 分析图像
     */
    async analyzeImage(imageData) {
        try {
            logger_1.logger.info('Analyzing image...');
            const result = await this.cvService.analyzeImage(imageData);
            return { success: true, data: result };
        }
        catch (error) {
            logger_1.logger.error('Image analysis failed:', error);
            throw error;
        }
    }
    /**
     * 搜索相似产品
     */
    async searchSimilarProducts(imageUrl) {
        try {
            logger_1.logger.info('Searching similar products...');
            const result = await this.cvService.searchSimilarProducts(imageUrl);
            return { success: true, data: result };
        }
        catch (error) {
            logger_1.logger.error('Product search failed:', error);
            throw error;
        }
    }
    /**
     * 处理网页
     */
    async processWebPage(url, options = { url }) {
        try {
            const response = await this._makeApiCall('/webpage/process', {
                url,
                options
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Web page processing failed:', error);
            throw error;
        }
    }
    /**
     * AI生成内容
     * @param options 生成选项
     */
    async generateContent(options) {
        try {
            const response = await this._makeApiCall('/ai/generate', options);
            return response.data;
        }
        catch (error) {
            this.logger.error('AI生成失败:', error);
            throw error;
        }
    }
    /**
     * 发送MCP消息
     * @param topic 消息主题
     * @param message 消息内容
     */
    async sendMCPMessage(topic, message) {
        try {
            if (!this.mcpClient) {
                throw new Error('MCP客户端未初始化');
            }
            await this.mcpClient.publish(topic, JSON.stringify(message));
            this.emit('mcp:message:sent', { topic, message });
        }
        catch (error) {
            this.logger.error('发送MCP消息失败:', error);
            throw error;
        }
    }
    /**
     * 测试API连接
     */
    async testConnection() {
        const startTime = Date.now();
        try {
            // 测试API连接
            const apiHealth = await this._makeApiCall('/health', {}, {
                timeout: 5000,
                method: 'get'
            });
            // 测试数据库连接
            const mysqlConnected = await this.dbService.query('SELECT 1').catch(() => false);
            const redisConnected = await this.dataService.testRedisConnection().catch(() => false);
            const mongoConnected = await this.dataService.testMongoConnection().catch(() => false);
            const endTime = Date.now();
            return {
                status: 'healthy',
                latency: endTime - startTime,
                services: {
                    api: true,
                    mysql: !!mysqlConnected,
                    redis: !!redisConnected,
                    mongo: !!mongoConnected
                }
            };
        }
        catch (error) {
            const endTime = Date.now();
            logger_1.logger.error('Connection test failed:', error);
            return {
                status: 'unhealthy',
                latency: endTime - startTime,
                services: {
                    api: false,
                    mysql: false,
                    redis: false,
                    mongo: false
                }
            };
        }
    }
    /**
     * 执行API调用
     * @private
     */
    async _makeApiCall(endpoint, data, config = {}) {
        const baseConfig = {
            baseURL: this.config.apiBaseUrl,
            timeout: this.config.timeout,
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            validateStatus: (status) => status >= 200 && status < 500
        };
        const finalConfig = {
            ...baseConfig,
            ...config,
            headers: {
                ...baseConfig.headers,
                ...config.headers
            }
        };
        let lastError = null;
        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                const response = await (config.method === 'get' ?
                    axios_1.default.get(endpoint, finalConfig) :
                    axios_1.default.post(endpoint, data, finalConfig));
                // Check for specific error responses
                if (response.status >= 400) {
                    throw new Error(`API错误: ${response.status} - ${response.data?.message || '未知错误'}`);
                }
                return response;
            }
            catch (error) {
                lastError = error;
                const errorMessage = error instanceof axios_1.AxiosError ?
                    `${error.message} (${error.code})` :
                    String(error);
                logger_1.logger.warn(`API调用失败 (尝试 ${attempt}/${this.config.maxRetries}): ${errorMessage}`);
                if (error instanceof axios_1.AxiosError) {
                    switch (error.response?.status) {
                        case 429:
                            // Rate limit hit - wait longer before retry
                            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
                            break;
                        case 401:
                        case 403:
                            // Auth errors - no retry
                            throw new Error(`认证失败: ${error.response.data?.message || error.message}`);
                        case 404:
                            throw new Error(`端点不存在: ${endpoint}`);
                        default:
                            if (attempt < this.config.maxRetries) {
                                // Regular failure - exponential backoff
                                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
                            }
                    }
                }
                else if (attempt < this.config.maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
                }
            }
        }
        logger_1.logger.error('API调用最终失败:', endpoint);
        throw lastError;
    }
    /**
     * 关闭服务
     */
    async shutdown() {
        try {
            await Promise.all([
                this.cvService.dispose(),
                this.dataService.dispose(),
                this.dbService.cleanup()
            ]);
            if (this.mcpClient) {
                await this.mcpClient.disconnect();
                this.emit('mcp:disconnected');
            }
            logger_1.logger.info('All services shut down successfully');
        }
        catch (error) {
            logger_1.logger.error('Error during shutdown:', error);
            throw error;
        }
    }
}
exports.MintroAIService = MintroAIService;
//# sourceMappingURL=MintroAIService.js.map