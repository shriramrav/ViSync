function getIframeFromSrc(src) {
  const iframes = document.querySelectorAll("iframe");

  for (let i = 0; i < iframes.length; i++) {
    if (iframes[i].src === src) {
      return iframes[i];
    }
  }
}

export { getIframeFromSrc };

