import { Config } from '../../types';
export default class CVService {
    private config;
    constructor(config: Config);
    initialize(): Promise<void>;
    processImage(imageData: Buffer): Promise<any>;
    analyzeImage(imageData: Buffer): Promise<any>;
    searchSimilarProducts(imageUrl: string): Promise<any>;
    dispose(): Promise<void>;
}
