import { styles } from 'app/components/presentational/generic/loading-indicator/styles';
import React, { Component, ReactNode } from 'react';
import { ActivityIndicator, View, Modal } from 'react-native';
import { config } from 'app/config/config';

/**
 * Presentational component to display a simple loading icon
 */
export class LoadingIndicatorComponent extends Component<ModalComponentInput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			visible,
			fullScreen
		} = this.props;

		if(visible) {

			if(fullScreen) {

				return (
					<Modal
						animationType='fade'
						transparent={true}
						visible={true}>
						<View style={[ styles.container, styles.containerFullScreen ]}>
							{this.renderLoadingIcon()}
						</View>
					</Modal>
				);
			}
			else {
				
				return (
					<View style={[ styles.container, styles.containerParentSize ]}>
						{this.renderLoadingIcon()}
					</View>
				);
			}
		}
		else {

			return null;
		}
	}

	/**
	 * Renders the main loading icon
	 * @returns the component
	 */
	private renderLoadingIcon(): ReactNode {

		return (
			<ActivityIndicator style={styles.indicator} size='large' color={config.ui.colors.colorAccent} />
		);
	}
}

/**
 * LoadingIndicatorComponent's input props
 */
export type ModalComponentInput = {

	/**
	 * Loading dialog visibility
	 */
	visible: boolean;

	/**
	 * Whether the modal is full screen or relative to its parent (its full width and height)
	 */
	fullScreen: boolean;
}
