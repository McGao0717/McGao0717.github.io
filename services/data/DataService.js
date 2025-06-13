"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = __importDefault(require("redis"));
const bull_1 = __importDefault(require("bull"));
const events_1 = require("events");
const promises_1 = __importDefault(require("fs/promises"));
const logger_1 = require("../../utils/logger");
class DataService extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.mongoClient = null;
        this.redisClient = null;
        this.taskQueue = null;
        this.config = config;
    }
    /**
     * 初始化数据库连接
     */
    async initialize() {
        try {
            // 连接 MongoDB
            await mongoose_1.default.connect(this.config.mongoUrl || 'mongodb://localhost:27017/mintro');
            this.mongoClient = mongoose_1.default.connection;
            // 连接 Redis
            this.redisClient = redis_1.default.createClient({
                url: this.config.redisUrl || 'redis://localhost:6379'
            });
            await this.redisClient.connect();
            // 初始化任务队列
            this.taskQueue = new bull_1.default('ai-tasks', {
                redis: this.config.redisUrl || 'redis://localhost:6379'
            });
            this.emit('database:connected');
        }
        catch (error) {
            this.emit('database:error', error);
            throw new Error(`数据库连接失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 添加任务到队列
     */
    async addTask(taskType, data) {
        if (!this.taskQueue) {
            throw new Error('任务队列未初始化');
        }
        try {
            return await this.taskQueue.add(taskType, data);
        }
        catch (error) {
            throw new Error(`添加任务失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 缓存数据
     */
    async cacheData(key, data, ttl) {
        if (!this.redisClient) {
            throw new Error('Redis客户端未初始化');
        }
        try {
            await this.redisClient.set(key, JSON.stringify(data));
            if (ttl) {
                await this.redisClient.expire(key, ttl);
            }
        }
        catch (error) {
            throw new Error(`缓存数据失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 获取缓存数据
     */
    async getCachedData(key) {
        if (!this.redisClient) {
            throw new Error('Redis客户端未初始化');
        }
        try {
            const data = await this.redisClient.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            throw new Error(`获取缓存数据失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 保存数据到MongoDB
     */
    async saveToMongo(collection, data) {
        if (!this.mongoClient) {
            throw new Error('MongoDB客户端未初始化');
        }
        try {
            const Model = mongoose_1.default.model(collection, new mongoose_1.default.Schema({}, { strict: false }));
            const document = new Model(data);
            return await document.save();
        }
        catch (error) {
            throw new Error(`保存数据失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 从MongoDB查询数据
     */
    async queryFromMongo(collection, query) {
        if (!this.mongoClient) {
            throw new Error('MongoDB客户端未初始化');
        }
        try {
            const Model = mongoose_1.default.model(collection, new mongoose_1.default.Schema({}, { strict: false }));
            return await Model.find(query).exec();
        }
        catch (error) {
            throw new Error(`查询数据失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 关闭数据库连接
     */
    async dispose() {
        try {
            if (this.mongoClient) {
                await mongoose_1.default.disconnect();
            }
            if (this.redisClient) {
                await this.redisClient.quit();
            }
            if (this.taskQueue) {
                await this.taskQueue.close();
            }
        }
        catch (error) {
            throw new Error(`关闭数据库连接失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 读取文件
     */
    async readFile(filePath) {
        try {
            return await promises_1.default.readFile(filePath);
        }
        catch (error) {
            throw new Error(`读取文件失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 测试Redis连接
     */
    async testRedisConnection() {
        if (!this.redisClient) {
            return false;
        }
        try {
            await this.redisClient.ping();
            return true;
        }
        catch (error) {
            logger_1.logger.error('Redis connection test failed:', error);
            return false;
        }
    }
    /**
     * 测试MongoDB连接
     */
    async testMongoConnection() {
        if (!this.mongoClient) {
            return false;
        }
        try {
            const state = this.mongoClient.readyState;
            return state === 1; // 1 = connected
        }
        catch (error) {
            logger_1.logger.error('MongoDB connection test failed:', error);
            return false;
        }
    }
}
exports.default = DataService;
//# sourceMappingURL=DataService.js.map