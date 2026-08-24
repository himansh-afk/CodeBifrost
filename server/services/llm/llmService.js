import ollama from "ollama";

export const generateAnswer = async (question, chunks) => {
    const context = chunks.map((chunk, index) => {
        return `SOURCE${index + 1}
        File:${chunk.filePath}
        Lines:${chunk.startLine}-${chunk.endLine}
        
        ${chunk.chunkText}
        `;
    }).join("\n_______________________________________\n");

    const prompt = `
    You are an AI codebase mentor answering questions about a repository.

    CRITICAL RULES:
    1. Answer ONLY using the provided code context. Do not add information from your training data.
    2. If asked to list things (libraries, functions, features, etc.), list ALL items present in the context—do not summarize or omit.
    3. Ground every claim in actual code. Reference specific file names and line ranges (e.g., "in auth.js lines 12-15").
    4. Do not invent files, functions, variables, classes, or behavior that isn't in the context.
    5. If the context genuinely lacks information to answer the question, say so explicitly—do not speculate.

    CONTEXT LIMITATIONS:
    - The provided chunks are partial sections, not complete files.
    - Use what is present. Do not claim code is missing if what's needed is in the context.
    - Reference ONLY what appears in the sources. Do not claim libraries are "used throughout" unless you see the actual imports/usage in the context.
    USER QUESTION:
    ${question}

    REPOSITORY CODE CONTEXT:
    ${context}

    `;

    const response = await ollama.chat({
        model: "llama3.2",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    });
    return response.message.content;
}