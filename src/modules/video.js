export function scan(message) {
  console.log("video test");

  chrome.runtime.sendMessage({
    message: message,
    data: document.querySelector("video") != null,
  });
}