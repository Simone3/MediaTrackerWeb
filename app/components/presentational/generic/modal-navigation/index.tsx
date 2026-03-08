import { ModalComponent, ModalComponentInput, ModalComponentOutput } from 'app/components/presentational/generic/modal';
import React, { Component, ReactNode } from 'react';
import { AppError } from 'app/data/models/internal/error';

/**
 * Presentational component to display a special modal with multiple screens
 */
export class NavigationModalComponent extends Component<NavigationModalComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			children,
			currentScreenIndex
		} = this.props;

		if(currentScreenIndex < 0 || currentScreenIndex >= children.length) {

			throw AppError.GENERIC.withDetails(`${currentScreenIndex} is not a valid index for the navigation modal`);
		}

		const currentScreen = children[currentScreenIndex];

		return (
			<ModalComponent {...this.props}>
				{currentScreen}
			</ModalComponent>
		);
	}
}

/**
 * NavigationModalComponent's input props
 */
export type NavigationModalComponentInput = ModalComponentInput & {

	/**
	 * Children are the array of all available screens
	 */
	children: ReactNode[];

	/**
	 * The index of the currently visible child
	 */
	currentScreenIndex: number;
}

/**
 * NavigationModalComponent's output props
 */
export type NavigationModalComponentOutput = ModalComponentOutput;

/**
 * NavigationModalComponent's props
 */
export type NavigationModalComponentProps = NavigationModalComponentInput & NavigationModalComponentOutput;
