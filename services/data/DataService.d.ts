import Bull from 'bull';
import { EventEmitter } from 'events';
import { Config } from '../../types';
declare class DataService extends EventEmitter {
    private config;
    private mongoClient;
    private redisClient;
    private taskQueue;
    constructor(config: Config);
    /**
     * 初始化数据库连接
     */
    initialize(): Promise<void>;
    /**
     * 添加任务到队列
     */
    addTask(taskType: string, data: any): Promise<Bull.Job>;
    /**
     * 缓存数据
     */
    cacheData(key: string, data: any, ttl?: number): Promise<void>;
    /**
     * 获取缓存数据
     */
    getCachedData(key: string): Promise<any>;
    /**
     * 保存数据到MongoDB
     */
    saveToMongo(collection: string, data: any): Promise<any>;
    /**
     * 从MongoDB查询数据
     */
    queryFromMongo(collection: string, query: any): Promise<any[]>;
    /**
     * 关闭数据库连接
     */
    dispose(): Promise<void>;
    /**
     * 读取文件
     */
    readFile(filePath: string): Promise<Buffer>;
    /**
     * 测试Redis连接
     */
    testRedisConnection(): Promise<boolean>;
    /**
     * 测试MongoDB连接
     */
    testMongoConnection(): Promise<boolean>;
}
export default DataService;
