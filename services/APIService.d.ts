import { APIServiceConfig, OCRResponse, ImageModerationResponse, DouyinVideoInfo, XiaohongshuNoteInfo } from '../types/api';
export declare class APIService {
    private readonly config;
    private readonly client;
    constructor(config: APIServiceConfig);
    private setupInterceptors;
    private getAuthHeaders;
    ocrImage(imagePath: string): Promise<OCRResponse>;
    moderateImage(imagePath: string): Promise<ImageModerationResponse>;
    getDouyinVideoInfo(videoId: string): Promise<DouyinVideoInfo>;
    getXiaohongshuInfo(noteId: string): Promise<XiaohongshuNoteInfo>;
}
