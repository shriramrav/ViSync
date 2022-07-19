export function scan(message) {
  chrome.runtime.sendMessage({
    message: message,
    data: document.querySelector("video") != null,
  });
}
