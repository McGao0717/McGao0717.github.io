import { Router } from 'express';
import { MintroAIService } from '../services/MintroAIService';
export declare class WebController {
    router: Router;
    private aiService;
    constructor(aiService?: MintroAIService);
    private setupRoutes;
    private getStatus;
    private processWebPage;
}
