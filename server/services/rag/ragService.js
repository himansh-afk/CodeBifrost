import { generateEmbedding } from "./embedder.js";
import { retrieveSimilarChunks } from "./retrievalService.js";
import { generateAnswer } from "../llm/llmService.js";

export const askCodebase = async (question) => {
    const questionEmbedding = await generateEmbedding(question);

    const relevantChunks = await retrieveSimilarChunks(questionEmbedding, 5);
    console.log("Chunks retrieved:", relevantChunks);
    const answer = await generateAnswer(question, relevantChunks);

    return {
        answer,
        sources: relevantChunks.map((chunk) => ({
            filePath: chunk.filePath,
            chunkIndex: chunk.chunkIndex,
            startLine: chunk.startLine,
            endLine: chunk.endLine,
            score: chunk.score
        }))
    }
}