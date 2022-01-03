export function scan(message, types) { 
    let type = '';

    if (_(types.video) != null) {
        type = types.video;
    } else if (_(`#${types.iframe}`) != null) {
        type = types.iframe;
    }

    chrome.runtime.sendMessage({
        message: message,
        data: {
            result: type !== '',
            type: type
        }
    });
}

// export let iframeInjection = '';