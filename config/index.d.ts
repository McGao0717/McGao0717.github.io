interface BaseConfig {
    env: string;
    version: string;
    port: number;
    host: string;
}
interface SecurityConfig {
    jwtSecret: string;
    jwtExpiresIn: string;
    apiSecret: string;
    allowedOrigins: string[];
    rateLimit: {
        windowMs: number;
        max: number;
    };
}
interface RedisConfig {
    host: string;
    port: number;
    password?: string;
    db: number;
    keyPrefix: string;
}
interface ElasticsearchConfig {
    node: string;
    auth: {
        username: string;
        password: string;
    };
    indices: {
        videos: string;
        users: string;
        comments: string;
    };
    options: {
        maxRetries: number;
        requestTimeout: number;
        sniffOnStart: boolean;
    };
}
interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    connectionLimit: number;
}
interface LogConfig {
    level: string;
    dir: string;
    maxSize: string;
    maxFiles: string;
    format: string;
}
interface ApiConfig {
    douyin: {
        apiKey: string;
        apiSecret: string;
        baseUrl: string;
    };
    xiaohongshu: {
        apiKey: string;
        apiSecret: string;
        baseUrl: string;
    };
}
interface Config {
    base: BaseConfig;
    security: SecurityConfig;
    redis: RedisConfig;
    elasticsearch: ElasticsearchConfig;
    database: DatabaseConfig;
    log: LogConfig;
    api: ApiConfig;
}
declare const config: Config;
export default config;
