export async function cache(key, value) {
    return new Promise((resolve) => {
        chrome.storage.sync.set({
            [key]: value
        }, resolve);
    });
}

export async function getCache(key) {
    return new Promise((resolve) => {
        chrome.storage.sync.get(key, resolve);
    });
}