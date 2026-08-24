export const chunkCode = (text, filePath) => {
    const lines = text.split("\n");
    const chunks = [];
    const chunkSize = 25;
    const overlap = 5;
    for (let i = 0; i < lines.length; i += chunkSize - overlap) {
        const chunkLines = lines.slice(i, i + chunkSize);
        chunks.push({
            filePath,
            chunkText: chunkLines.join("\n"),
            chunkIndex: chunks.length,
            startLine: i + 1,
            endLine: i + chunkLines.length
        });
    }
    return chunks;
}