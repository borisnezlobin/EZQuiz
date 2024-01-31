const verifyObject = (obj: any, keys: string[]) => {
    if (!obj) {
        return false;
    }
    for (const key of keys) {
        if (!obj[key]) {
            return false;
        }
    }
    return true;
}

const verifyRequestBody = (obj: any, keys: string[]): string | null => {
    if (!verifyObject(obj, keys)) {
        return 'Invalid request body';
    }
    return null;
}

export { verifyObject, verifyRequestBody };