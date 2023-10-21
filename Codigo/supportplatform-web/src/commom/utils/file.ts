export function validatePath(path: string) {
    // Expressão regular que verifica o formato do caminho de arquivo
    const regex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/.+\..+$/;

    if (regex.test(path)) {
        return true; // Caminho válido
    } else {
        return false; // Caminho inválido
    }
}
