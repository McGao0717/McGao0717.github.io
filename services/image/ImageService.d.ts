export declare class ImageService {
    private nsfwModel;
    private ocrWorker;
    constructor();
    private initializeServices;
    /**
     * OCR Service - Extract text from images
     */
    extractTextFromImage(imageBuffer: Buffer): Promise<string>;
    /**
     * Image Moderation Service
     */
    moderateImage(imageBuffer: Buffer): Promise<{
        isNSFW: boolean;
        categories: {
            [key: string]: number;
        };
    }>;
    /**
     * Taobao Image Search Service
     */
    searchSimilarProducts(imageUrl: string): Promise<any>;
    /**
     * Random Image Service
     */
    getRandomImage(category: 'anime' | 'landscape'): Promise<string>;
    /**
     * Image Processing Utilities
     */
    preprocessImage(imageBuffer: Buffer): Promise<Buffer>;
    cleanup(): Promise<void>;
}
