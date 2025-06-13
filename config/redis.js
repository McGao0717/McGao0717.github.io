"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.cacheUtils = exports.CACHE_TTL = exports.CACHE_KEYS = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../utils/logger");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
// Redis配置
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
    reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    }
};
// Redis客户端实例
const redisClient = new ioredis_1.default(redisConfig);
exports.redisClient = redisClient;
// Redis事件监听
redisClient.on('error', (error) => {
    console.error('Redis connection error:', error);
});
redisClient.on('connect', () => {
    console.log('Redis connected successfully');
});
redisClient.on('ready', () => {
    logger_1.logger.info('Redis就绪');
});
redisClient.on('reconnecting', () => {
    logger_1.logger.warn('Redis重新连接中');
});
// 缓存键前缀
exports.CACHE_KEYS = {
    VIDEO_DETAIL: 'video:detail',
    USER_VIDEOS: 'user:videos',
    HOT_VIDEOS: 'hot:videos',
    SEARCH_RESULTS: 'search:results',
    USER_PROFILE: 'user:profile',
    TRENDING_TAGS: 'trending:tags',
    SYSTEM_CONFIG: 'system:config',
    API_STATS: 'api:stats'
};
// 缓存过期时间（秒）
exports.CACHE_TTL = {
    VIDEO_DETAIL: 3600, // 视频详情缓存1小时
    USER_VIDEOS: 1800, // 用户视频列表缓存30分钟
    HOT_VIDEOS: 300, // 热门视频缓存5分钟
    SEARCH_RESULTS: 60, // 搜索结果缓存1分钟
    USER_PROFILE: 7200, // 用户资料缓存2小时
    TRENDING_TAGS: 900, // 热门标签缓存15分钟
    SYSTEM_CONFIG: 86400, // 系统配置缓存24小时
    API_STATS: 60 // API统计数据缓存1分钟
};
// 高级缓存工具函数
exports.cacheUtils = {
    // 获取缓存
    async get(key) {
        try {
            const data = await redisClient.get(key);
            logger_1.logUtils.logCache('GET', key, !!data);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            logger_1.logger.error('获取缓存失败:', error);
            return null;
        }
    },
    // 设置缓存
    async set(key, value, expireSeconds) {
        try {
            const stringValue = JSON.stringify(value);
            if (expireSeconds) {
                await redisClient.set(key, stringValue, 'EX', expireSeconds);
            }
            else {
                await redisClient.set(key, stringValue);
            }
            logger_1.logUtils.logCache('SET', key, false, { expireSeconds });
        }
        catch (error) {
            logger_1.logger.error('设置缓存失败:', error);
        }
    },
    // 删除缓存
    async del(key) {
        try {
            await redisClient.del(key);
            logger_1.logUtils.logCache('DEL', key, false);
        }
        catch (error) {
            logger_1.logger.error('删除缓存失败:', error);
        }
    },
    // 批量获取缓存
    async mget(keys) {
        try {
            const results = await redisClient.mget(keys);
            return results.map(item => item ? JSON.parse(item) : null);
        }
        catch (error) {
            logger_1.logger.error('批量获取缓存失败:', error);
            return keys.map(() => null);
        }
    },
    // 批量设置缓存
    async mset(keyValues, expireSeconds) {
        try {
            const pipeline = redisClient.pipeline();
            Object.entries(keyValues).forEach(([key, value]) => {
                const stringValue = JSON.stringify(value);
                if (expireSeconds) {
                    pipeline.set(key, stringValue, 'EX', expireSeconds);
                }
                else {
                    pipeline.set(key, stringValue);
                }
            });
            await pipeline.exec();
        }
        catch (error) {
            logger_1.logger.error('批量设置缓存失败:', error);
        }
    },
    // 设置带有前缀的键
    getKey(prefix, ...parts) {
        return [prefix, ...parts].join(':');
    },
    // 增加视频热度分数
    async incrVideoHotScore(videoId, increment = 1) {
        try {
            await redisClient.zincrby(exports.CACHE_KEYS.HOT_VIDEOS, increment, videoId);
            logger_1.logUtils.logCache('ZINCRBY', exports.CACHE_KEYS.HOT_VIDEOS, false, { videoId, increment });
        }
        catch (error) {
            logger_1.logger.error('增加视频热度分数失败:', error);
        }
    },
    // 获取热门视频ID列表
    async getHotVideoIds(start = 0, end = 9) {
        try {
            return await redisClient.zrevrange(exports.CACHE_KEYS.HOT_VIDEOS, start, end);
        }
        catch (error) {
            logger_1.logger.error('获取热门视频列表失败:', error);
            return [];
        }
    },
    // 使用Hash存储对象字段
    async hset(key, field, value) {
        try {
            await redisClient.hset(key, field, JSON.stringify(value));
            logger_1.logUtils.logCache('HSET', key, false, { field });
        }
        catch (error) {
            logger_1.logger.error('设置Hash字段失败:', error);
        }
    },
    // 获取Hash字段
    async hget(key, field) {
        try {
            const data = await redisClient.hget(key, field);
            logger_1.logUtils.logCache('HGET', key, !!data, { field });
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            logger_1.logger.error('获取Hash字段失败:', error);
            return null;
        }
    },
    // 获取所有Hash字段
    async hgetall(key) {
        try {
            const data = await redisClient.hgetall(key);
            return Object.entries(data).reduce((acc, [field, value]) => {
                acc[field] = JSON.parse(value);
                return acc;
            }, {});
        }
        catch (error) {
            logger_1.logger.error('获取所有Hash字段失败:', error);
            return null;
        }
    },
    // 设置带过期时间的计数器
    async setCounter(key, expireSeconds) {
        try {
            const count = await redisClient.incr(key);
            if (count === 1) {
                await redisClient.expire(key, expireSeconds);
            }
            return count;
        }
        catch (error) {
            logger_1.logger.error('设置计数器失败:', error);
            return 0;
        }
    },
    // 获取计数器值
    async getCounter(key) {
        try {
            const value = await redisClient.get(key);
            return value ? parseInt(value, 10) : 0;
        }
        catch (error) {
            logger_1.logger.error('获取计数器失败:', error);
            return 0;
        }
    },
    // 分布式锁
    async acquireLock(lockKey, expireSeconds) {
        try {
            const acquired = await redisClient.set(lockKey, '1', 'EX', expireSeconds, 'NX');
            return !!acquired;
        }
        catch (error) {
            logger_1.logger.error('获取分布式锁失败:', error);
            return false;
        }
    },
    // 释放分布式锁
    async releaseLock(lockKey) {
        try {
            await redisClient.del(lockKey);
        }
        catch (error) {
            logger_1.logger.error('释放分布式锁失败:', error);
        }
    }
};
//# sourceMappingURL=redis.js.map