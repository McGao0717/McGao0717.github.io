export interface Config {
    apiKey: string;
    apiBaseUrl: string;
    modelVersion: string;
    maxRetries: number;
    timeout: number;
    debug: boolean;
    logLevel: string;
    mongoUrl: string;
    redisUrl: string;
    uploadDir: string;
}
export interface ImageProcessingOptions {
    resize?: {
        width: number;
        height: number;
    };
    format?: 'jpeg' | 'png' | 'webp';
    quality?: number;
    effects?: {
        brightness?: number;
        contrast?: number;
        saturation?: number;
    };
}
export interface VideoProcessingOptions {
    resize?: {
        width: number;
        height: number;
    };
    format?: 'mp4' | 'webm';
    fps?: number;
    duration?: number;
    startTime?: number;
    endTime?: number;
}
export interface WebPageOptions {
    url: string;
    selector?: string;
    timeout?: number;
    waitUntil?: string;
}
export interface AIGenerationOptions {
    model: string;
    prompt: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
}
export interface MCPMessage {
    type: string;
    content: string;
    timestamp: number;
    metadata?: Record<string, any>;
}
export interface NLPOptions {
    language?: string;
    tokenizer?: string;
    model?: string;
    maxLength?: number;
    temperature?: number;
}
export interface CVOptions {
    model?: string;
    confidence?: number;
    iouThreshold?: number;
    maxDetections?: number;
}
export interface TaskOptions {
    priority?: number;
    attempts?: number;
    backoff?: {
        type: 'fixed' | 'exponential';
        delay: number;
    };
    timeout?: number;
    removeOnComplete?: boolean;
    removeOnFail?: boolean;
}
