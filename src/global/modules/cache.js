export function cache(key, value) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({
            [key]: value
        }, resolve);
    });
}

export function getCache(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, 
            result => resolve(result[key])
        );
    });
}