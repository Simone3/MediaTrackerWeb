import React, { Component, ReactNode } from 'react';
import { HeaderComponent, HeaderComponentInput } from 'app/components/presentational/generic/header';
import { SearchHeaderComponentInput, SearchHeaderComponentOutput, SearchHeaderComponent } from 'app/components/presentational/generic/header-search';
import { AppError } from 'app/data/models/internal/error';
import { HeaderBackComponent } from 'app/components/presentational/generic/header-back';

/**
 * Presentational component to display the media items list header, in several different modes
 */
export class MediaItemsListHeaderComponent extends Component<MediaItemsListHeaderComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			searchMode,
			viewGroupMode
		} = this.props;

		if(viewGroupMode && searchMode) {

			throw AppError.GENERIC.withDetails('Cannot have both modes active');
		}

		if(viewGroupMode) {

			return this.renderViewGroupMode();
		}
		else {

			return <SearchHeaderComponent {...this.props} />;
		}
	}

	/**
	 * Helper to render the header in view group mode
	 * @returns the component
	 */
	private renderViewGroupMode(): ReactNode {

		return (
			<HeaderComponent
				{...this.props.viewGroupHeaderInput}
				componentsLeft={
					<HeaderBackComponent
						onClick={this.props.onRequestViewGroupModeExit}
					/>
				}
			/>
		);
	}
}

/**
 * MediaItemsListHeaderComponent's input props
 */
export type MediaItemsListHeaderComponentInput = SearchHeaderComponentInput & {

	/**
	 * If true, the view group mode is active
	 */
	viewGroupMode: boolean;

	/**
	 * Props for the view group mode
	 */
	viewGroupHeaderInput: HeaderComponentInput;
}

/**
 * MediaItemsListHeaderComponent's output props
 */
export type MediaItemsListHeaderComponentOutput = SearchHeaderComponentOutput & {

	/**
	 * Callback for the back button press during view group mode (i.e. user requests to exit the mode)
	 */
	onRequestViewGroupModeExit: () => void;
}

/**
 * MediaItemsListHeaderComponent's props
 */
export type MediaItemsListHeaderComponentProps = MediaItemsListHeaderComponentInput & MediaItemsListHeaderComponentOutput;

