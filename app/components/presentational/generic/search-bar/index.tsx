import { styles } from 'app/components/presentational/generic/search-bar/styles';
import React, { Component, ReactNode } from 'react';
import { View, TouchableWithoutFeedback, ActivityIndicator, TextInputProps, StyleSheet, TextStyle } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ImageComponent } from 'app/components/presentational/generic/image';
import { config } from 'app/config/config';
import { images } from 'app/utilities/images';

/**
 * Presentational component to display a search input with icons
 */
export class SearchBarComponent extends Component<SearchBarComponentProps, SearchBarComponentState> {
	
	/**
	 * @override
	 */
	public state: SearchBarComponentState = { term: '' };

	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<View style={styles.container}>
				{this.renderField()}
				{this.renderLoadingIcon()}
				{this.renderClearButton()}
			</View>
		);
	}

	/**
	 * Helper to render the input field
	 * @returns the component
	 */
	private renderField(): ReactNode {

		const {
			onSearch,
			onChangeText,
			value,
			style
		} = this.props;

		return (
			<TextInput
				{...this.props}
				value={value ? value : this.state.term}
				style={StyleSheet.compose<TextStyle, TextStyle, TextStyle>(styles.input, style)}
				onChangeText={(newValue) => {

					this.setState({ term: newValue });

					if(onChangeText) {

						onChangeText(newValue);
					}
				}}
				returnKeyType='search'
				onSubmitEditing={(event) => {

					const term = this.getSearchTerm(event.nativeEvent.text);
					if(term) {

						onSearch(term);
					}
				}}
			/>
		);
	}

	/**
	 * Helper to render the clear button
	 * @returns the component
	 */
	private renderClearButton(): ReactNode {
		
		if(this.state.term) {

			return (
				<TouchableWithoutFeedback
					onPress={() => {
						this.setState({ term: '' });
					}}>
					<ImageComponent
						source={images.clearButton()}
						tintColor={config.ui.colors.colorContrastText}
						style={styles.clearIcon}
					/>
				</TouchableWithoutFeedback>
			);
		}
		else {
			
			return null;
		}
	}

	/**
	 * Helper to render the loading icon
	 * @returns the component
	 */
	private renderLoadingIcon(): ReactNode {
		
		if(this.props.showLoading) {

			return (
				<ActivityIndicator
					style={styles.loadingIcon}
					size='small'
					color={config.ui.colors.colorAccent}
				/>
			);
		}

		return undefined;
	}
	
	/**
	 * Gets the modified search term
	 * @param term the term
	 * @returns a valid search term or undefined if search should not be submitted
	 */
	private getSearchTerm(term: string | undefined): string | undefined {

		if(!term) {

			return undefined;
		}

		const trimmed = term.trim();

		if(!trimmed) {

			return undefined;
		}

		return trimmed;
	}
}

/**
 * SearchBarComponent's input props
 */
export type SearchBarComponentInput = TextInputProps & {

	/**
	 * If a small loading icon next to the search input is currently visibile
	 */
	showLoading?: boolean;
}

/**
 * SearchBarComponent's output props
 */
export type SearchBarComponentOutput = {

	/**
	 * The search callback. Only invoked with valid strings, with at least 1 character.
	 */
	onSearch: (term: string) => void;
}

/**
 * SearchBarComponent's props
 */
export type SearchBarComponentProps = SearchBarComponentInput & SearchBarComponentOutput;

/**
 * SearchBarComponent's state
 */
type SearchBarComponentState = {

	/**
	 * The current input value
	 */
	term: string;
}
