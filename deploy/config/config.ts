export const getErrorEmails = (stage: string): string[] => {
    if (stage === 'prod') {
        return ['niedoba.lukas@gmail.com'];
    }
    if (stage === 'beta') {
        return ['niedoba.lukas@gmail.com'];
    }
    return [];
}