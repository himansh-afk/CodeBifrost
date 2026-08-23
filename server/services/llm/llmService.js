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
    You are an AI codebase mentor.

    Answer the user's question using the provided repository
    code context.

    The provided context consists of retrieved code chunks.
    These chunks may be partial sections of files, so do not
    expect complete files.

    Use the code that is actually present in the context.
    Do not claim that code is missing if the relevant code
    needed to answer the question is present.

    Do not invent files, functions, variables, or behavior.

    When explaining the answer, mention the relevant file
    names and line ranges.

    If the provided code genuinely does not contain enough
    information to answer the question, clearly say so.

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