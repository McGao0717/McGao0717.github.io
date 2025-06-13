"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysqlConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'project_ai_user',
    password: process.env.MYSQL_PASSWORD || 'shidaijinya503',
    database: process.env.MYSQL_DATABASE || 'project_ai_db',
    connectionLimit: parseInt(process.env.MYSQL_CONNECTION_LIMIT || '10', 10)
};
exports.default = mysqlConfig;
//# sourceMappingURL=mysql.config.js.map