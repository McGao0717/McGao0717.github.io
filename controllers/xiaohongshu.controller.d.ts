import { Request, Response } from 'express';
export declare class XiaohongshuController {
    private service;
    constructor();
    getVideoDetail: (req: Request, res: Response) => Promise<void>;
    getUserVideos: (req: Request, res: Response) => Promise<void>;
    getTrendingVideos: (req: Request, res: Response) => Promise<void>;
    searchVideos: (req: Request, res: Response) => Promise<void>;
    getVideoComments: (req: Request, res: Response) => Promise<void>;
    getVideoStats: (req: Request, res: Response) => Promise<void>;
}
