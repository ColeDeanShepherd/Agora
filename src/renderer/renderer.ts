// Ensures the internal iframe inside each <webview> shadow DOM fills its container.
export function applyWebviewIframeStyles(): void {
  const webviews = document.querySelectorAll<HTMLElement>('webview');

  webviews.forEach((webview) => {
    const shadow = webview.shadowRoot;
    if (!shadow) {
      return;
    }

    const style = document.createElement('style');
    style.textContent = 'iframe { height: 100% !important; }';
    shadow.appendChild(style);
  });
}
