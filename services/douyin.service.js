"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DouyinService = void 0;
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
class DouyinService {
    constructor() {
        this.baseUrl = process.env.DOUYIN_API_URL || 'https://api.douyin.com/v1';
        this.apiKey = process.env.DOUYIN_API_KEY || '';
    }
    // 获取视频详情
    async getVideoDetails(videoId) {
        const cacheKey = `douyin:video:${videoId}`;
        // 尝试从缓存获取
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/video/detail`, {
                params: {
                    video_id: videoId
                },
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const video = response.data.data;
            // 缓存结果，设置5分钟过期
            await redis_1.redis.set(cacheKey, JSON.stringify(video), 'EX', 300);
            return video;
        }
        catch (error) {
            logger_1.logger.error('抖音API调用失败 - 获取视频详情:', error);
            throw error;
        }
    }
    // 获取用户视频列表
    async getUserVideos(userId, page = 1, pageSize = 20) {
        const cacheKey = `douyin:user:${userId}:videos:${page}:${pageSize}`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/user/videos`, {
                params: {
                    user_id: userId,
                    page,
                    page_size: pageSize
                },
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const result = response.data.data;
            // 缓存结果，设置1分钟过期
            await redis_1.redis.set(cacheKey, JSON.stringify(result), 'EX', 60);
            return result;
        }
        catch (error) {
            logger_1.logger.error('抖音API调用失败 - 获取用户视频列表:', error);
            throw error;
        }
    }
    // 获取热门视频
    async getTrendingVideos(category = 'all', limit = 50) {
        const cacheKey = `douyin:trending:${category}:${limit}`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/trending/videos`, {
                params: {
                    category,
                    limit
                },
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const videos = response.data.data;
            // 缓存结果，设置1分钟过期
            await redis_1.redis.set(cacheKey, JSON.stringify(videos), 'EX', 60);
            return videos;
        }
        catch (error) {
            logger_1.logger.error('抖音API调用失败 - 获取热门视频:', error);
            throw error;
        }
    }
    // 搜索视频
    async searchVideos(keyword, page = 1, pageSize = 20) {
        const cacheKey = `douyin:search:${keyword}:${page}:${pageSize}`;
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/search/videos`, {
                params: {
                    keyword,
                    page,
                    page_size: pageSize
                },
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const result = response.data.data;
            // 缓存结果，设置30秒过期
            await redis_1.redis.set(cacheKey, JSON.stringify(result), 'EX', 30);
            return result;
        }
        catch (error) {
            logger_1.logger.error('抖音API调用失败 - 搜索视频:', error);
            throw error;
        }
    }
}
exports.DouyinService = DouyinService;
//# sourceMappingURL=douyin.service.js.map