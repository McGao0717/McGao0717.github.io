import { EventEmitter } from 'events';
import type { Config } from '../types';
import { WebPageOptions, AIGenerationOptions, MCPMessage } from '../types';
export declare class MintroAIService extends EventEmitter {
    private config;
    private logger;
    private mcpClient;
    private nlpService;
    private cvService;
    private dataService;
    private dbService;
    constructor(partialConfig?: Partial<Config>);
    /**
     * 初始化服务
     */
    initialize(): Promise<void>;
    /**
     * 处理文本
     */
    processText(text: string): Promise<any>;
    /**
     * 处理图像
     */
    processImage(imageData: Buffer | string): Promise<any>;
    /**
     * 生成文本
     */
    generateText(prompt: string, options?: any): Promise<any>;
    /**
     * 问答系统
     */
    answerQuestion(context: string, question: string): Promise<any>;
    /**
     * 处理视频
     */
    processVideo(videoData: Buffer | string): Promise<any>;
    /**
     * 分析图像
     */
    analyzeImage(imageData: Buffer): Promise<any>;
    /**
     * 搜索相似产品
     */
    searchSimilarProducts(imageUrl: string): Promise<any>;
    /**
     * 处理网页
     */
    processWebPage(url: string, options?: WebPageOptions): Promise<any>;
    /**
     * AI生成内容
     * @param options 生成选项
     */
    generateContent(options: AIGenerationOptions): Promise<any>;
    /**
     * 发送MCP消息
     * @param topic 消息主题
     * @param message 消息内容
     */
    sendMCPMessage(topic: string, message: MCPMessage): Promise<void>;
    /**
     * 测试API连接
     */
    testConnection(): Promise<{
        status: string;
        latency: number;
        services: {
            api: boolean;
            mysql: boolean;
            redis: boolean;
            mongo: boolean;
        };
    }>;
    /**
     * 执行API调用
     * @private
     */
    private _makeApiCall;
    /**
     * 关闭服务
     */
    shutdown(): Promise<void>;
}
