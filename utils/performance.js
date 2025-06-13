"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitor = void 0;
exports.monitor = monitor;
const events_1 = require("events");
class PerformanceMonitor extends events_1.EventEmitter {
    constructor(logger, maxMetricsPerOperation = 100) {
        super();
        this.metrics = new Map();
        this.maxMetricsPerOperation = maxMetricsPerOperation;
        this.logger = logger;
    }
    /**
     * 记录性能指标
     */
    record(operation, duration, success) {
        const metric = {
            operation,
            duration,
            success,
            timestamp: Date.now()
        };
        let operationMetrics = this.metrics.get(operation);
        if (!operationMetrics) {
            operationMetrics = [];
            this.metrics.set(operation, operationMetrics);
        }
        operationMetrics.push(metric);
        if (operationMetrics.length > this.maxMetricsPerOperation) {
            operationMetrics.shift();
        }
        this.emit('metric', metric);
        this.logger.debug('Performance metric recorded', { metric });
    }
    /**
     * 获取指定操作的平均持续时间
     */
    getAverageDuration(operation) {
        const metrics = this.metrics.get(operation);
        if (!metrics || metrics.length === 0) {
            return 0;
        }
        const successfulMetrics = metrics.filter(m => m.success);
        if (successfulMetrics.length === 0) {
            return 0;
        }
        const totalDuration = successfulMetrics.reduce((sum, metric) => sum + metric.duration, 0);
        return totalDuration / successfulMetrics.length;
    }
    /**
     * 获取指定操作的成功率
     */
    getSuccessRate(operation) {
        const metrics = this.metrics.get(operation);
        if (!metrics || metrics.length === 0) {
            return 0;
        }
        const successfulCalls = metrics.filter(m => m.success).length;
        return (successfulCalls / metrics.length) * 100;
    }
    /**
     * 获取性能报告
     */
    getReport() {
        const report = {};
        for (const [operation, metrics] of this.metrics.entries()) {
            const successfulMetrics = metrics.filter(m => m.success);
            const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
            report[operation] = {
                totalCalls: metrics.length,
                successfulCalls: successfulMetrics.length,
                failedCalls: metrics.length - successfulMetrics.length,
                averageDuration: totalDuration / metrics.length,
                successRate: successfulMetrics.length / metrics.length,
                metrics
            };
        }
        return report;
    }
    /**
     * 清除所有指标
     */
    clear() {
        this.metrics.clear();
        this.emit('clear');
    }
}
exports.PerformanceMonitor = PerformanceMonitor;
function monitor(operationName) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const monitor = this.monitor;
            if (!monitor) {
                throw new Error('Performance monitor not found in class instance');
            }
            const startTime = Date.now();
            try {
                const result = await originalMethod.apply(this, args);
                const duration = Date.now() - startTime;
                monitor.record(operationName, duration, true);
                return result;
            }
            catch (error) {
                const duration = Date.now() - startTime;
                monitor.record(operationName, duration, false);
                throw error;
            }
        };
        return descriptor;
    };
}
exports.default = PerformanceMonitor;
//# sourceMappingURL=performance.js.map