import { CSSProperties } from 'react';
import { OwnPlatformIconInternal } from 'app/data/models/internal/own-platform';
import ownPlatformDefaultIcon from 'app/resources/images/ic_input_own_platform.svg';
import platformAndroidIcon from 'app/resources/images/ic_platform_android.svg';
import platformAppleIcon from 'app/resources/images/ic_platform_apple.svg';
import platformBookIcon from 'app/resources/images/ic_platform_book.svg';
import platformDiscIcon from 'app/resources/images/ic_platform_disc.svg';
import platformDisneyIcon from 'app/resources/images/ic_platform_disney.svg';
import platformDownloadIcon from 'app/resources/images/ic_platform_download.svg';
import platformEpicIcon from 'app/resources/images/ic_platform_epic.svg';
import platformGogIcon from 'app/resources/images/ic_platform_gog.svg';
import platformHuluIcon from 'app/resources/images/ic_platform_hulu.svg';
import platformKindleIcon from 'app/resources/images/ic_platform_kindle.svg';
import platformNetflixIcon from 'app/resources/images/ic_platform_netflix.svg';
import platformOriginIcon from 'app/resources/images/ic_platform_origin.svg';
import platformPlaystationIcon from 'app/resources/images/ic_platform_playstation.svg';
import platformSteamIcon from 'app/resources/images/ic_platform_steam.svg';
import platformSwitchIcon from 'app/resources/images/ic_platform_switch.svg';
import platformUplayIcon from 'app/resources/images/ic_platform_uplay.svg';

export const ownPlatformIcons: Record<OwnPlatformIconInternal, string> = {
	default: ownPlatformDefaultIcon,
	android: platformAndroidIcon,
	apple: platformAppleIcon,
	book: platformBookIcon,
	disc: platformDiscIcon,
	disney: platformDisneyIcon,
	download: platformDownloadIcon,
	epic: platformEpicIcon,
	gog: platformGogIcon,
	hulu: platformHuluIcon,
	kindle: platformKindleIcon,
	netflix: platformNetflixIcon,
	origin: platformOriginIcon,
	playstation: platformPlaystationIcon,
	steam: platformSteamIcon,
	switch: platformSwitchIcon,
	uplay: platformUplayIcon
};

export const buildOwnPlatformMaskStyle = <TUrl extends string, TColor extends string>(
	icon: OwnPlatformIconInternal,
	color: string,
	urlProperty: TUrl,
	colorProperty: TColor
): CSSProperties & Record<TUrl | TColor, string> => {
	return {
		[urlProperty]: `url(${ownPlatformIcons[icon]})`,
		[colorProperty]: color
	} as CSSProperties & Record<TUrl | TColor, string>;
};
