import { searchSimilar } from "./vectorStore.js";

export const retrieveSimilarChunks = async (queryEmbedding, topK = 5) => {
    const results = searchSimilar(queryEmbedding, topK);
    return results;
}