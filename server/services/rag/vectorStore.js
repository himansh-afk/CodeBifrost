const vectorStore = [];

export const addChunks = (chunks) => {
    vectorStore.push(...chunks);
};

export const clearStore = () => {
    vectorStore.length = 0;
};

const cosineSimilarity = (a, b) => {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        magnitudeA += a[i] * a[i];
        magnitudeB += b[i] * b[i];
    }
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    if (magnitudeA === 0 || magnitudeB === 0) {
        return 0;
    }
    return dotProduct / (magnitudeA * magnitudeB);
}

export const getStoreSize = () => vectorStore.length;

export const searchSimilar = (queryEmbedding, topK = 8) => {
    const results = vectorStore.map(chunk => {
        const score = cosineSimilarity(
            queryEmbedding, chunk.embedding
        );
        return {
            ...chunk,
            score
        };
    });
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
};