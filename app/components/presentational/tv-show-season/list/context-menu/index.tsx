import React, { Component, ReactNode } from 'react';
import { TvShowSeasonInternal } from 'app/data/models/internal/media-items/tv-show';
import { ModalComponent } from 'app/components/presentational/generic/modal';
import { i18n } from 'app/utilities/i18n';
import { ButtonsListComponentButton, ButtonsListComponent } from 'app/components/presentational/generic/buttons-list';
import { ConfirmAlert } from 'app/components/presentational/generic/confirm-alert';
import { images } from 'app/utilities/images';

/**
 * Presentational component to display a modal dialog with the TV show season options
 */
export class TvShowSeasonContextMenuComponent extends Component<TvShowSeasonContextMenuComponentInput & TvShowSeasonContextMenuComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {

		const {
			tvShowSeason
		} = this.props;

		if(tvShowSeason) {

			const {
				close
			} = this.props;

			const buttons: ButtonsListComponentButton[] = [];

			// Edit button is always present
			buttons.push(this.getEditButton(tvShowSeason));

			// Complete button only if the season is yet to be completed
			if(tvShowSeason.episodesNumber && (!tvShowSeason.watchedEpisodesNumber || tvShowSeason.watchedEpisodesNumber !== tvShowSeason.episodesNumber)) {

				buttons.push(this.getCompleteButton(tvShowSeason));
			}

			// Delete button is always present
			buttons.push(this.getDeleteButton(tvShowSeason));

			return (
				<ModalComponent
					visible={true}
					onClose={close}
					horizontalPosition='center'
					verticalPosition='bottom'>
					<ButtonsListComponent
						title={i18n.t('tvShowSeason.list.contextMenuTitle', { seasonNumber: tvShowSeason.number })}
						titleIcon={images.seasonsField()}
						buttons={buttons}
					/>
				</ModalComponent>
			);
		}
		else {

			return null;
		}
	}

	/**
	 * The "Delete" button
	 * @param tvShowSeason the season
	 * @returns the button
	 */
	private getDeleteButton(tvShowSeason: TvShowSeasonInternal): ButtonsListComponentButton {

		const {
			delete: deleteCallback,
			close
		} = this.props;

		return {
			label: i18n.t('tvShowSeason.list.delete'),
			icon: images.deleteButton(),
			onClick: (): void => {

				const title = i18n.t('tvShowSeason.common.alert.delete.title');
				const message = i18n.t('tvShowSeason.common.alert.delete.message', { seasonNumber: tvShowSeason.number });
				ConfirmAlert.alert(title, message, () => {

					deleteCallback(tvShowSeason);
					close();
				});
			}
		};
	}

	/**
	 * The "Edit" button
	 * @param tvShowSeason the season
	 * @returns the button
	 */
	private getEditButton(tvShowSeason: TvShowSeasonInternal): ButtonsListComponentButton {

		const {
			edit,
			close
		} = this.props;

		return {
			label: i18n.t('tvShowSeason.list.edit'),
			icon: images.editButton(),
			onClick: (): void => {

				edit(tvShowSeason);
				close();
			}
		};
	}

	/**
	 * The "Complete" button
	 * @param tvShowSeason the season
	 * @returns the button
	 */
	private getCompleteButton(tvShowSeason: TvShowSeasonInternal): ButtonsListComponentButton {

		const {
			complete,
			close
		} = this.props;

		return {
			label: i18n.t('tvShowSeason.list.complete'),
			icon: images.completeButton(),
			onClick: (): void => {

				complete(tvShowSeason);
				close();
			}
		};
	}
}

/**
 * TvShowSeasonContextMenuComponent's input props
 */
export type TvShowSeasonContextMenuComponentInput = {

	/**
	 * The TV show season linked with the modal. Undefined means no modal is displayed.
	 */
	tvShowSeason: TvShowSeasonInternal | undefined;
};

/**
 * TvShowSeasonContextMenuComponent's output props
 */
export type TvShowSeasonContextMenuComponentOutput = {

	/**
	 * Callback to edit the TV show season
	 */
	edit: (tvShowSeason: TvShowSeasonInternal) => void;
	
	/**
	 * Callback to delete the TV show season
	 */
	delete: (tvShowSeason: TvShowSeasonInternal) => void;
	
	/**
	 * Callback to complete the TV show season
	 */
	complete: (tvShowSeason: TvShowSeasonInternal) => void;

	/**
	 * Callback when the component requests to be closed
	 */
	close: () => void;
};

