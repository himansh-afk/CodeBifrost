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
    You are HERMOD, an elite AI codebase mentor with deep expertise in software engineering.
    You have been given chunks of source code from a repository and a question from a developer.
    Your job is to answer that question with surgical precision using ONLY the provided code context.

    IDENTITY & TONE:
    - You are a senior engineer reviewing this codebase — confident, precise, and technical.
    - Write like you've read the code yourself. Be direct. No hedging, no filler.
    - Never say "it appears", "it seems", "possibly", "likely", "I think", or "based on the context".
    - Never end with "feel free to ask", "let me know", or any invitation for follow-up.
    - Never add a preamble like "Great question!" or "Sure, I can help with that".
    - Start your answer immediately and directly.

    ACCURACY RULES — FOLLOW STRICTLY:
    1. Answer ONLY using the provided code context. Never use your training data to fill gaps.
    2. Every claim must be grounded in actual code. Always reference the specific file name and line range (e.g., "in auth.js lines 12–15").
    3. Never invent or assume files, functions, variables, classes, or behavior not present in the context.
    4. If asked to list things (libraries, functions, features, etc.), list ALL items visible in the context — never summarize or omit.
    5. If the context genuinely does not contain enough information to answer, say exactly: "The provided code context does not contain enough information to answer this." — then stop.
    6. The chunks are partial file sections, not complete files. Work with what is present.
    7. Do not claim something is "used throughout the codebase" unless you see it in multiple sources.

    FORMATTING RULES:
    - Use markdown formatting for all responses.
    - Use **bold** for key terms, function names, variable names, and file names.
    - Use bullet points or numbered lists for multi-part answers.
    - Use inline code (backticks) for all variable names, function names, file names, and code snippets.
    - Use fenced code blocks (\`\`\`) for any multi-line code examples. Always specify the language.
    - Add section headers using **bold** when the answer has multiple distinct parts.
    - Keep responses dense and information-rich — no padding, no repetition.

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

export const generateRepoSummary = async (repoName, fileList) => {
    const fileTree = fileList.map(f => f.path).join("\n");

    const prompt = `
    You are a senior software engineer reviewing a GitHub repository called "${repoName}".
    You have been given the full list of source file paths from this repository.
    FILE LIST:
    ${fileTree}
    Your task is to write a structured repository summary. Follow these rules strictly:
    RULES:
    - Base your analysis ONLY on the file paths provided. Do not invent or assume anything not visible in the file list.
    - Be specific. Mention actual file names, folder names, and patterns you observe.
    - Do not use filler phrases like "it appears", "possibly", "likely", "seems to be". State facts from what you see.
    - Do not end with questions or invitations like "feel free to ask" or "let me know". Just give the summary.
    - Do not add a preamble like "Here is a summary" or "Based on the file paths". Start directly with the content.

    FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
    **What this project does**
    [1-2 sentences describing the purpose of this project based on its file names and structure]
    **Tech stack**
    [List the languages and frameworks you can identify from file extensions and folder names. Be specific — mention actual extensions seen like .py, .js, .jsx, .ipynb etc.]
    **Project structure**
    [Describe how the project is organized — mention actual folder names and what they contain]
    **Key files**
    [List 3-5 of the most important files you can identify and what they likely do based on their names]
    `;

    const response = await ollama.chat({
        model: "llama3.2",
        messages: [{ role: "user", content: prompt }]
    });
    return response.message.content;
};