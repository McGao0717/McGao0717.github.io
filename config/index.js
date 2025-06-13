"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// 加载环境变量
dotenv_1.default.config();
// 配置验证函数
const validateConfig = (config) => {
    const requiredEnvVars = [
        'NODE_ENV',
        'APP_VERSION',
        'PORT',
        'JWT_SECRET',
        'API_SECRET',
        'REDIS_HOST',
        'DB_HOST',
        'DB_USER',
        'DB_PASSWORD',
        'DB_NAME'
    ];
    const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
};
// 创建配置对象
const config = {
    base: {
        env: process.env.NODE_ENV || 'development',
        version: process.env.APP_VERSION || '1.0.0',
        port: parseInt(process.env.PORT || '3000', 10),
        host: process.env.HOST || '0.0.0.0'
    },
    security: {
        jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
        apiSecret: process.env.API_SECRET || 'default-api-secret',
        allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(','),
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15分钟
            max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10)
        }
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0', 10),
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'vpa:'
    },
    elasticsearch: {
        node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
        auth: {
            username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
            password: process.env.ELASTICSEARCH_PASSWORD || '',
        },
        indices: {
            videos: process.env.ELASTICSEARCH_VIDEOS_INDEX || 'videos',
            users: process.env.ELASTICSEARCH_USERS_INDEX || 'users',
            comments: process.env.ELASTICSEARCH_COMMENTS_INDEX || 'comments',
        },
        options: {
            maxRetries: parseInt(process.env.ELASTICSEARCH_MAX_RETRIES || '3', 10),
            requestTimeout: parseInt(process.env.ELASTICSEARCH_REQUEST_TIMEOUT || '30000', 10),
            sniffOnStart: process.env.ELASTICSEARCH_SNIFF_ON_START === 'true',
        }
    },
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'video_platform',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10)
    },
    log: {
        level: process.env.LOG_LEVEL || 'info',
        dir: process.env.LOG_DIR || path_1.default.join(process.cwd(), 'logs'),
        maxSize: process.env.LOG_MAX_SIZE || '20m',
        maxFiles: process.env.LOG_MAX_FILES || '14d',
        format: process.env.LOG_FORMAT || 'json'
    },
    api: {
        douyin: {
            apiKey: process.env.DOUYIN_API_KEY || '',
            apiSecret: process.env.DOUYIN_API_SECRET || '',
            baseUrl: process.env.DOUYIN_API_BASE_URL || 'https://api.douyin.com'
        },
        xiaohongshu: {
            apiKey: process.env.XIAOHONGSHU_API_KEY || '',
            apiSecret: process.env.XIAOHONGSHU_API_SECRET || '',
            baseUrl: process.env.XIAOHONGSHU_API_BASE_URL || 'https://api.xiaohongshu.com'
        }
    }
};
// 验证配置
validateConfig(config);
exports.default = config;
//# sourceMappingURL=index.js.map