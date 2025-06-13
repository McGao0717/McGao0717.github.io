"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySQLService = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const logger_1 = require("../utils/logger");
class MySQLService {
    constructor(config) {
        this.pool = promise_1.default.createPool(config);
        logger_1.logger.info('MySQL connection pool created');
    }
    async query(sql, values) {
        try {
            const [results] = await this.pool.execute(sql, values);
            return results;
        }
        catch (error) {
            logger_1.logger.error('MySQL query error:', error);
            throw error;
        }
    }
    async cleanup() {
        try {
            await this.pool.end();
            logger_1.logger.info('MySQL connection pool closed');
        }
        catch (error) {
            logger_1.logger.error('Error closing MySQL connection pool:', error);
            throw error;
        }
    }
    // Video stats methods
    async updateVideoStats(stats) {
        const sql = `
      INSERT INTO video_stats (video_id, platform, views, likes, comments, shares)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        views = views + VALUES(views),
        likes = VALUES(likes),
        comments = VALUES(comments),
        shares = VALUES(shares)
    `;
        await this.query(sql, [
            stats.video_id,
            stats.platform,
            stats.views,
            stats.likes,
            stats.comments,
            stats.shares
        ]);
    }
    async getVideoStats(videoId) {
        const sql = 'SELECT * FROM video_stats WHERE video_id = ?';
        const results = await this.query(sql, [videoId]);
        return results[0] || null;
    }
    // Interaction methods
    async recordInteraction(interaction) {
        const sql = `
      INSERT INTO video_interactions (user_id, video_id, interaction_type)
      VALUES (?, ?, ?)
    `;
        await this.query(sql, [
            interaction.user_id,
            interaction.video_id,
            interaction.interaction_type
        ]);
    }
    async getUserInteractions(userId, limit = 10) {
        const sql = 'SELECT * FROM video_interactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?';
        return await this.query(sql, [userId, limit]);
    }
    // Comment methods
    async addComment(comment) {
        const sql = `
      INSERT INTO video_comments (video_id, user_id, content, parent_id)
      VALUES (?, ?, ?, ?)
    `;
        const result = await this.query(sql, [
            comment.video_id,
            comment.user_id,
            comment.content,
            comment.parent_id || null
        ]);
        return result[0].insertId;
    }
    async getVideoComments(videoId, page = 1, pageSize = 20) {
        const offset = (page - 1) * pageSize;
        const sql = `
      SELECT * FROM video_comments 
      WHERE video_id = ? AND status = 1 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
        return await this.query(sql, [videoId, pageSize, offset]);
    }
    // Tag methods
    async addVideoTags(videoId, tags) {
        const values = tags.map(tag => [videoId, tag]);
        const sql = 'INSERT INTO video_tags (video_id, tag_name) VALUES ?';
        await this.query(sql, [values]);
    }
    async getVideoTags(videoId) {
        const sql = 'SELECT tag_name FROM video_tags WHERE video_id = ?';
        const results = await this.query(sql, [videoId]);
        return results.map(row => row.tag_name);
    }
}
exports.MySQLService = MySQLService;
//# sourceMappingURL=mysql.service.js.map