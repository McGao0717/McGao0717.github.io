"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inference_1 = require("@huggingface/inference");
const transformers_1 = require("@xenova/transformers");
const natural_1 = __importDefault(require("natural"));
const events_1 = require("events");
class NLPService extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.tokenizer = new natural_1.default.WordTokenizer();
        this.hf = new inference_1.HfInference(this.config.apiKey);
    }
    /**
     * 文本分词
     */
    async tokenize(text) {
        return this.tokenizer.tokenize(text);
    }
    /**
     * 命名实体识别
     */
    async performNER(text) {
        try {
            const ner = await (0, transformers_1.pipeline)('ner', 'Xenova/bert-base-NER');
            return await ner(text);
        }
        catch (error) {
            throw new Error(`NER处理失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 情感分析
     */
    async analyzeSentiment(text) {
        try {
            return await this.hf.textClassification({
                model: 'nlptown/bert-base-multilingual-uncased-sentiment',
                inputs: text
            });
        }
        catch (error) {
            throw new Error(`情感分析失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 文本生成
     */
    async generateText(prompt, options = {}) {
        try {
            return await this.hf.textGeneration({
                model: 'gpt2',
                inputs: prompt,
                parameters: options
            });
        }
        catch (error) {
            throw new Error(`文本生成失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 文本摘要
     */
    async summarizeText(text, options = {}) {
        try {
            return await this.hf.summarization({
                model: 'facebook/bart-large-cnn',
                inputs: text,
                parameters: options
            });
        }
        catch (error) {
            throw new Error(`文本摘要失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * 问答系统
     */
    async answerQuestion(context, question) {
        try {
            return await this.hf.questionAnswering({
                model: 'deepset/roberta-base-squad2',
                inputs: {
                    question,
                    context
                }
            });
        }
        catch (error) {
            throw new Error(`问答处理失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
exports.default = NLPService;
//# sourceMappingURL=NLPService.js.map