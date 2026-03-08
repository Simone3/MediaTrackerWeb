import React, { ReactNode, Component } from 'react';
import { styles } from 'app/components/presentational/form/components/tv-show-season-handler/styles';
import { FormInputComponentInput, FormInputComponentOutput, FormInputComponent } from 'app/components/presentational/form/components/generic';
import { PlaceholderTextComponent } from 'app/components/presentational/generic/placeholder-text';
import { TouchableOpacity } from 'react-native';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { i18n } from 'app/utilities/i18n';
import { mediaItemUtils } from 'app/utilities/media-item-utils';

/**
 * Presentational component to display a TV show season picker, with the possibility to open a selection screen on click
 */
export class TvShowSeasonHandlerComponent extends Component<TvShowSeasonHandlerComponentProps> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		return (
			<FormInputComponent {...this.props}>
				{this.renderInput()}
			</FormInputComponent>
		);
	}

	/**
	 * Helper to render the visibile form field
	 * @returns the component
	 */
	private renderInput(): ReactNode {

		const {
			seasons,
			disabled,
			placeholder,
			requestSeasonHandling
		} = this.props;

		let textValue = '';
		if(seasons && seasons.length > 0) {

			const counters = mediaItemUtils.getTvShowCounters(seasons);
			textValue = i18n.t('mediaItem.details.labels.seasons', {
				seasonsNumber: counters.seasonsNumber,
				episodesNumber: counters.episodesNumber,
				watchedEpisodesNumber: counters.watchedEpisodesNumber
			});
		}

		return (
			<TouchableOpacity
				style={styles.inputContainer}
				disabled={disabled}
				onPress={() => {
					requestSeasonHandling(seasons);
				}}>
				<PlaceholderTextComponent
					style={styles.input}
					placeholder={placeholder}>
					{textValue}
				</PlaceholderTextComponent>
			</TouchableOpacity>
		);
	}
}

/**
 * TvShowSeasonHandlerComponent's input props
 */
export type TvShowSeasonHandlerComponentInput = FormInputComponentInput & {

	/**
	 * The currently selected seasons, if any
	 */
	seasons: TvShowSeasonInternal[] | undefined;

	/**
	 * The input placeholder
	 */
	placeholder: string;
}

/**
 * TvShowSeasonHandlerComponent's output props
 */
export type TvShowSeasonHandlerComponentOutput = FormInputComponentOutput & {

	/**
	 * Callback to request the actual TV show season handling screen
	 */
	requestSeasonHandling: (currentSeasons?: TvShowSeasonInternal[]) => void;
}

/**
 * TvShowSeasonHandlerComponent's props
 */
export type TvShowSeasonHandlerComponentProps = TvShowSeasonHandlerComponentInput & TvShowSeasonHandlerComponentOutput;
