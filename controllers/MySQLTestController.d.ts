import { Router } from 'express';
declare class MySQLTestController {
    private mysqlService;
    router: Router;
    constructor();
    private setupRoutes;
    private updateVideoStats;
    private getVideoStats;
    private recordInteraction;
    private getUserInteractions;
    private addComment;
    private getVideoComments;
    private addVideoTags;
    private getVideoTags;
}
declare const _default: MySQLTestController;
export default _default;
