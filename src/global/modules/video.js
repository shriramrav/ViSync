export function scan(message) { 
    chrome.runtime.sendMessage({
        message: message,
        data: _('video') != null
    });
}

// export let iframeInjection = '';