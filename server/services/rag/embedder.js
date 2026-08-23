import ollama from "ollama";

export const generateEmbedding = async (text) => {
    const response = await ollama.embed({
        model: "nomic-embed-text",
        input: text
    }
    );

    if (response.embeddings[0].length === 0) {
        throw new Error("Ollama returned empty embedding vector.");
    }

    return response.embeddings[0];
}