"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
const ImageController_1 = __importDefault(require("../controllers/ImageController"));
const VideoController_1 = __importDefault(require("../controllers/VideoController"));
const WebController_1 = __importDefault(require("../controllers/WebController"));
const MySQLTestController_1 = __importDefault(require("../controllers/MySQLTestController"));
function setupRoutes(app) {
    app.use('/api/image', ImageController_1.default.router);
    app.use('/api/video', VideoController_1.default.router);
    app.use('/api/web', WebController_1.default.router);
    app.use('/api/mysql-test', MySQLTestController_1.default.router);
}
//# sourceMappingURL=index.js.map