/**
 * Whether the current runtime looks like an iOS/iPadOS WebKit browser.
 * This intentionally includes other iOS browsers because they all use WebKit.
 * @returns true when the current browser matches the affected platform
 */
export const isIosWebKitBrowser = (): boolean => {
	if(typeof navigator === 'undefined') {
		return false;
	}

	const userAgent = navigator.userAgent || '';
	const maxTouchPoints = navigator.maxTouchPoints || 0;
	const isAppleTouchPlatform = /iPad|iPhone|iPod/.test(userAgent) ||
		(/Macintosh/.test(userAgent) && maxTouchPoints > 1);
	const isWebKitEngine = /AppleWebKit/i.test(userAgent);

	return isAppleTouchPlatform && isWebKitEngine;
};
