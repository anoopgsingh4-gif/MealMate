export const mkBlinkitListLink = (items) => {
  const query = encodeURIComponent([...new Set(items)].join(", "));
  return `https://blinkit.com/s/?q=${query}`;
};

export const mkBlinkitMobileUrl = (ua, items) => {
  const query = encodeURIComponent([...new Set(items)].join(", "));
  const httpsUrl = `https://blinkit.com/s/?q=${query}`;
  const isAndroid = /Android/i.test(ua || "");
  if (isAndroid) {
    const pkg = "com.grofers.customerapp";
    return `intent://s/?q=${query}#Intent;scheme=https;package=${pkg};S.browser_fallback_url=${encodeURIComponent(httpsUrl)};end`;
  }
  return httpsUrl;
};

export const openBlinkit = (items) => {
  const url = mkBlinkitMobileUrl(navigator.userAgent || "", items);
  window.location.href = url;
};
