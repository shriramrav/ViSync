export function scan(message) { 
    console.log(`video message : ${message}`);
    console.log(_('video') != null);
    chrome.runtime.sendMessage({
        message: message,
        data: _('video') != null
    });
}