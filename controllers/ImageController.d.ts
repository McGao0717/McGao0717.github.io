import { Router } from 'express';
import { MintroAIService } from '../services/MintroAIService';
export declare class ImageController {
    router: Router;
    private upload;
    private aiService;
    constructor(aiService?: MintroAIService);
    private setupRoutes;
    private uploadImage;
    private analyzeImage;
    private processImage;
    private searchProducts;
    private getImageInfo;
}
