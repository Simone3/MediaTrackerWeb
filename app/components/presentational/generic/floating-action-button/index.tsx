import React, { Component, ReactNode } from 'react';

/**
 * Presentational component for a Floating Action Button (FAB)
 */
export class FABComponent extends Component<FABComponentInput & FABComponentOutput> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<button
				type='button'
				className='floating-action-button'
				onClick={this.props.onPress}
				aria-label={this.props.text}>
				<span className='floating-action-button-label'>{this.props.text}</span>
			</button>
		);
	}
}

/**
 * FABComponent's input props
 */
export type FABComponentInput = {
	/**
	 * The text to display on the FAB, it should usually be a 1-character string
	 */
	text: string;
}

/**
 * FABComponent's output props
 */
export type FABComponentOutput = {
	/**
	 * The FAB press callback
	 */
	onPress: () => void;
}
