import { AxiosInstance, AxiosRequestHeaders } from 'axios';
export interface APIServiceConfig {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    baseURL?: string;
}
export type APIHeaders = AxiosRequestHeaders & {
    'X-API-Key': string;
    'X-Access-Token': string;
    'X-Timestamp': string;
    'X-Signature': string;
};
export interface OCRResponse {
    success: boolean;
    text: string;
    confidence?: number;
}
export interface ImageModerationResponse {
    success: boolean;
    safe: boolean;
    categories: string[];
    scores?: Record<string, number>;
}
export interface DouyinVideoInfo {
    success: boolean;
    title: string;
    author: string;
    stats: {
        likes?: number;
        comments?: number;
        shares?: number;
    };
}
export interface XiaohongshuNoteInfo {
    success: boolean;
    title: string;
    author: string;
    content: {
        text?: string;
        images?: string[];
        videos?: string[];
    };
    stats: {
        likes?: number;
        comments?: number;
        shares?: number;
    };
}
export declare class APIService {
    readonly client: AxiosInstance;
    constructor(config: APIServiceConfig);
    getAuthHeaders(): APIHeaders;
    ocrImage(imagePath: string): Promise<OCRResponse>;
    moderateImage(imagePath: string): Promise<ImageModerationResponse>;
    getDouyinVideoInfo(videoId: string): Promise<DouyinVideoInfo>;
    getXiaohongshuInfo(noteId: string): Promise<XiaohongshuNoteInfo>;
}
