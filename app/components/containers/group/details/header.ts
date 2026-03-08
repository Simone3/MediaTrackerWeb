import { HeaderComponent, HeaderComponentInput } from 'app/components/presentational/generic/header';
import { State } from 'app/redux/state/state';
import { i18n } from 'app/utilities/i18n';
import { connect } from 'react-redux';

const mapStateToProps = (state: State, ownProps: GroupDetailsHeaderContainerProps): HeaderComponentInput => {
	
	const group = state.groupDetails.group;

	return {
		...ownProps,
		title: group && group.id ? group.name : i18n.t('group.details.title.new')
	};
};

/**
 * Container component that handles Redux state for HeaderComponent
 */
export const GroupDetailsHeaderContainer = connect(
	mapStateToProps
)(HeaderComponent);

/**
 * GroupDetailsHeaderContainer's props
 */
export type GroupDetailsHeaderContainerProps = Omit<HeaderComponentInput, 'title'>;
