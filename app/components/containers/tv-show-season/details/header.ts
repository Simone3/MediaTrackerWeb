import { HeaderComponent, HeaderComponentInput } from 'app/components/presentational/generic/header';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';
import { connect } from 'react-redux';

const mapStateToProps = (state: State, ownProps: TvShowSeasonDetailsHeaderContainerProps): HeaderComponentInput => {
	
	const formMode = state.tvShowSeasonDetails.formMode;
	const tvShowSeason = state.tvShowSeasonDetails.tvShowSeason;

	return {
		...ownProps,
		title: formMode === 'EXISTING' && tvShowSeason ? i18n.t('tvShowSeason.details.title.existing', { seasonNumber: tvShowSeason.number }) : i18n.t('tvShowSeason.details.title.new')
	};
};

/**
 * Container component that handles Redux state for HeaderComponent
 */
export const TvShowSeasonDetailsHeaderContainer = connect(
	mapStateToProps
)(HeaderComponent);

/**
 * TvShowSeasonDetailsHeaderContainer's props
 */
export type TvShowSeasonDetailsHeaderContainerProps = Omit<HeaderComponentInput, 'title'>;
