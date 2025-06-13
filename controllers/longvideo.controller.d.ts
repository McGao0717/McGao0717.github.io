import { Request, Response } from 'express';
export declare class LongVideoController {
    private service;
    constructor();
    getVideoDetail: (req: Request, res: Response) => Promise<void>;
    getAlbumInfo: (req: Request, res: Response) => Promise<void>;
    getAlbumVideos: (req: Request, res: Response) => Promise<void>;
    getVideoPlayInfo: (req: Request, res: Response) => Promise<void>;
    getVideoChapters: (req: Request, res: Response) => Promise<void>;
    pushMediaInfo: (req: Request, res: Response) => Promise<void>;
    pushMediaInfoBatch: (req: Request, res: Response) => Promise<void>;
}
