import { HeaderComponent, HeaderComponentInput } from 'app/components/presentational/generic/header';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';
import { connect } from 'react-redux';

const mapStateToProps = (state: State, ownProps: OwnPlatformDetailsHeaderContainerProps): HeaderComponentInput => {
	
	const ownPlatform = state.ownPlatformDetails.ownPlatform;

	return {
		...ownProps,
		title: ownPlatform && ownPlatform.id ? ownPlatform.name : i18n.t('ownPlatform.details.title.new')
	};
};

/**
 * Container component that handles Redux state for HeaderComponent
 */
export const OwnPlatformDetailsHeaderContainer = connect(
	mapStateToProps
)(HeaderComponent);

/**
 * OwnPlatformDetailsHeaderContainer's props
 */
export type OwnPlatformDetailsHeaderContainerProps = Omit<HeaderComponentInput, 'title'>;
