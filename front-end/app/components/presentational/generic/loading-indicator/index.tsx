import { Component, ReactNode } from 'react';

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

		if(!visible) {
			return null;
		}

		const containerClassName = fullScreen ?
			'loading-indicator-container loading-indicator-container-full-screen' :
			'loading-indicator-container loading-indicator-container-parent-size';

		return (
			<div className={containerClassName}>
				<div className='loading-indicator-spinner' />
			</div>
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
	 * Whether the modal uses the stronger full-screen overlay or the standard viewport-centered in-page overlay
	 */
	fullScreen: boolean;
};
