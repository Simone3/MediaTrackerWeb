import React, { Component, ReactNode } from 'react';
import { config } from 'app/config/config';
import { navigationService } from 'app/utilities/navigation-service';
import { HeaderIconComponent } from 'app/components/presentational/generic/header-icon';
import { images } from 'app/utilities/images';
import { BackHandler } from 'react-native';

/**
 * Presentational component to display a standard header back button.
 * Also handles "physical" back button on Android with the same callback.
 */
export class HeaderBackComponent extends Component<HeaderBackComponentProps> {

	/**
	 * @override
	 */
	public constructor(props: HeaderBackComponentInput) {
		
		super(props);

		this.onPhysicalBackButtonPressAndroid = this.onPhysicalBackButtonPressAndroid.bind(this);
		this.onBackButtonPress = this.onBackButtonPress.bind(this);
	}
	
	/**
	 * @override
	 */
	public componentDidMount(): void {

		// Add listener for "physical" back button on Android
		BackHandler.addEventListener('hardwareBackPress', this.onPhysicalBackButtonPressAndroid);
	}

	/**
	 * @override
	 */
	public componentWillUnmount(): void {
		
		// Remove listener for "physical" back button on Android
		BackHandler.removeEventListener('hardwareBackPress', this.onPhysicalBackButtonPressAndroid);
	}

	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			disabled
		} = this.props;

		return (
			<HeaderIconComponent
				source={images.back()}
				tintColor={config.ui.colors.colorContrastText}
				onClick={this.onBackButtonPress}
				clickStatus={disabled ? 'DISABLED' : 'ENABLED'}
			/>
		);
	}

	/**
	 * Action on back button press for the "physical" button on Android
	 * @returns always true: back behaviour always handled internally
	 */
	private onPhysicalBackButtonPressAndroid(): boolean {

		this.onBackButtonPress();
		return true;
	}

	/**
	 * Action on back button press (both header button and "physical" button on Android)
	 */
	private onBackButtonPress(): void {

		const {
			onClick
		} = this.props;

		if(onClick) {

			onClick();
		}
		else {

			this.defaultOnClick();
		}
	}
	
	/**
	 * Default on press callback
	 */
	private defaultOnClick(): void {

		navigationService.back();
	}
}

/**
 * HeaderBackComponent's input props
 */
export type HeaderBackComponentInput = {

	/**
	 * If the button is not currently clickable
	 */
	disabled?: boolean;
}

/**
 * HeaderBackComponent's output props
 */
export type HeaderBackComponentOutput = {

	/**
	 * Click callback, defaults to navigationService.back()
	 */
	onClick?: () => void;
}

/**
 * HeaderBackComponent's props
 */
export type HeaderBackComponentProps = HeaderBackComponentInput & HeaderBackComponentOutput;
