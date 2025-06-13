import { Request, Response } from 'express';
export declare class DouyinController {
    private service;
    constructor();
    getVideoDetail: (req: Request, res: Response) => Promise<void>;
    getUserVideos: (req: Request, res: Response) => Promise<void>;
    getTrendingVideos: (req: Request, res: Response) => Promise<void>;
    searchVideos: (req: Request, res: Response) => Promise<void>;
    private fetchVideoDetails;
    private fetchUserVideos;
    private fetchTrendingVideos;
    private performVideoSearch;
}
