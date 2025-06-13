"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateImageOptions = validateImageOptions;
exports.validateVideoOptions = validateVideoOptions;
exports.validateWebPageOptions = validateWebPageOptions;
/**
 * 验证图像处理选项
 */
function validateImageOptions(options) {
    if (!options.type) {
        throw new Error('图像处理类型是必需的');
    }
    if (!['enhancement', 'filter', 'resize', 'convert'].includes(options.type)) {
        throw new Error('无效的图像处理类型');
    }
    if (options.type === 'resize') {
        if (!options.width && !options.height) {
            throw new Error('调整大小时需要指定宽度或高度');
        }
        if (options.width && options.width <= 0) {
            throw new Error('宽度必须大于0');
        }
        if (options.height && options.height <= 0) {
            throw new Error('高度必须大于0');
        }
    }
    if (options.quality !== undefined) {
        if (options.quality < 0 || options.quality > 100) {
            throw new Error('质量必须在0-100之间');
        }
    }
}
/**
 * 验证视频处理选项
 */
function validateVideoOptions(options) {
    if (!options.type) {
        throw new Error('视频处理类型是必需的');
    }
    if (!['trim', 'merge', 'convert', 'effect'].includes(options.type)) {
        throw new Error('无效的视频处理类型');
    }
    if (options.type === 'trim') {
        if (options.startTime === undefined || options.endTime === undefined) {
            throw new Error('剪辑时需要指定开始和结束时间');
        }
        if (options.startTime < 0) {
            throw new Error('开始时间不能为负数');
        }
        if (options.endTime <= options.startTime) {
            throw new Error('结束时间必须大于开始时间');
        }
    }
    if (options.quality !== undefined) {
        if (options.quality < 0 || options.quality > 100) {
            throw new Error('质量必须在0-100之间');
        }
    }
}
/**
 * 验证网页处理选项
 */
function validateWebPageOptions(options) {
    if (!options.type) {
        throw new Error('网页处理类型是必需的');
    }
    if (!['style', 'modify', 'clone', 'optimize'].includes(options.type)) {
        throw new Error('无效的网页处理类型');
    }
    if (options.type === 'style' && !options.template) {
        throw new Error('应用样式时需要指定模板');
    }
    if (options.type === 'modify' && (!options.elements || options.elements.length === 0)) {
        throw new Error('修改网页时需要指定要修改的元素');
    }
}
//# sourceMappingURL=validation.js.map