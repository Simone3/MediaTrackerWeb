import React, { Component, ReactNode } from 'react';
import { HeaderComponent, HeaderComponentInput } from 'app/components/presentational/generic/header';
import { styles } from 'app/components/presentational/generic/header-search/styles';
import { SearchBarComponent, SearchBarComponentInput, SearchBarComponentOutput } from 'app/components/presentational/generic/search-bar';
import { View, Dimensions } from 'react-native';
import { HeaderBackComponent } from 'app/components/presentational/generic//header-back';

/**
 * Presentational component to display an header that supports two modes: normal (title + icons) or search (search input + back button to exit search)
 */
export class SearchHeaderComponent extends Component<SearchHeaderComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		if(this.props.searchMode) {

			return this.renderSearchMode();
		}
		else {

			return this.renderNormalMode();
		}
	}

	/**
	 * Helper to render the header in normal mode
	 * @returns the component
	 */
	private renderNormalMode(): ReactNode {

		return (
			<HeaderComponent {...this.props.normalHeaderInput} />
		);
	}

	/**
	 * Helper to render the header in search mode
	 * @returns the component
	 */
	private renderSearchMode(): ReactNode {

		const {
			onRequestSearchModeExit,
			searchHeaderInput,
			searchHeaderOutput
		} = this.props;

		return (
			<View style={[ styles.searchModeContainer, { width: Dimensions.get('screen').width }]}>
				<View style={styles.backContainer}>
					<HeaderBackComponent
						onClick={onRequestSearchModeExit}
					/>
				</View>
				<View style={styles.searchContainer}>
					<SearchBarComponent
						{...searchHeaderInput}
						{...searchHeaderOutput}
						style={styles.searchBarInput}
					/>
				</View>
			</View>
		);
	}
}

/**
 * SearchHeaderComponent's input props
 */
export type SearchHeaderComponentInput = {

	/**
	 * If true, the search mode is active
	 */
	searchMode: boolean;

	/**
	 * Props for the normal mode
	 */
	normalHeaderInput: HeaderComponentInput;

	/**
	 * Props for the search mode
	 */
	searchHeaderInput: SearchBarComponentInput;
}

/**
 * SearchHeaderComponent's output props
 */
export type SearchHeaderComponentOutput = {

	/**
	 * Callback for the back button press during search (i.e. user requests to exit the mode)
	 */
	onRequestSearchModeExit: () => void;

	/**
	 * Props for the search mode
	 */
	searchHeaderOutput: SearchBarComponentOutput;
}

/**
 * SearchHeaderComponent's props
 */
export type SearchHeaderComponentProps = SearchHeaderComponentInput & SearchHeaderComponentOutput;

