import { searchSimilar } from "./vectorStore.js";

export const retrieveSimilarChunks = async (queryEmbedding, namespace, topK = 8) => {
    const results = await searchSimilar(queryEmbedding, namespace, topK);
    return results;
}