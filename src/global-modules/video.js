// Note: iframe id hard-coded
export function scan(message) { 
    let data = '';
    if (document.querySelector('video') != null) {
        data = 'video';
    } else if (document.getElementById('__video_player_') != null) {
        data = '__video_player_';
    }

    chrome.runtime.sendMessage({
        message: message,
        data: {
            result: data !== '',
            name: data
        }
    });
}

export let iframeInjection = '';