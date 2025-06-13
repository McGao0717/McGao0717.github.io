"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = ensureDir;
exports.safeWriteFile = safeWriteFile;
exports.readFileIfExists = readFileIfExists;
exports.getFileExtension = getFileExtension;
exports.isImageFile = isImageFile;
exports.isVideoFile = isVideoFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * 确保目录存在，如果不存在则创建
 */
async function ensureDir(dirPath) {
    try {
        if (!fs_1.default.existsSync(dirPath)) {
            await fs_1.default.promises.mkdir(dirPath, { recursive: true });
        }
    }
    catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
}
/**
 * 安全地写入文件，确保目录存在
 */
async function safeWriteFile(filePath, data, options) {
    const dir = path_1.default.dirname(filePath);
    await ensureDir(dir);
    await fs_1.default.promises.writeFile(filePath, data, options);
}
/**
 * 如果文件存在则读取文件，不存在返回null
 */
async function readFileIfExists(filePath, options) {
    try {
        return await fs_1.default.promises.readFile(filePath, options);
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}
/**
 * 获取文件扩展名（小写）
 */
function getFileExtension(filePath) {
    return path_1.default.extname(filePath || '').toLowerCase();
}
/**
 * 判断是否为图片文件
 */
function isImageFile(filePath) {
    const ext = getFileExtension(filePath);
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
}
/**
 * 判断是否为视频文件
 */
function isVideoFile(filePath) {
    const ext = getFileExtension(filePath);
    return ['.mp4', '.avi', '.mov', '.wmv', '.mkv'].includes(ext);
}
//# sourceMappingURL=file.js.map