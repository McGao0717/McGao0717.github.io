import fs from 'fs';
/**
 * 确保目录存在，如果不存在则创建
 */
export declare function ensureDir(dirPath: string): Promise<void>;
/**
 * 安全地写入文件，确保目录存在
 */
export declare function safeWriteFile(filePath: string, data: string | Buffer, options?: fs.WriteFileOptions): Promise<void>;
/**
 * 如果文件存在则读取文件，不存在返回null
 */
export declare function readFileIfExists(filePath: string, options?: {
    encoding?: BufferEncoding;
} | BufferEncoding): Promise<string | Buffer | null>;
/**
 * 获取文件扩展名（小写）
 */
export declare function getFileExtension(filePath: string): string;
/**
 * 判断是否为图片文件
 */
export declare function isImageFile(filePath: string): boolean;
/**
 * 判断是否为视频文件
 */
export declare function isVideoFile(filePath: string): boolean;
