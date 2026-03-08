import { EntityPickerFieldComponent, EntityPickerFieldComponentInput, EntityPickerFieldComponentOutput } from 'app/components/presentational/form/fields/entity-picker';
import { requestOwnPlatformSelection } from 'app/redux/actions/own-platform/generators';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnPlatformPickerFieldContainerProps): EntityPickerFieldComponentOutput => {

	return {
		...ownProps,
		requestEntitySelection: () => {
			dispatch(requestOwnPlatformSelection());
		}
	};
};

/**
 * Container component that handles Redux state for EntityPickerFieldComponent
 */
export const OwnPlatformPickerFieldContainer = connect(
	null,
	mapDispatchToProps
)(EntityPickerFieldComponent);

/**
 * OwnPlatformPickerFieldContainer's input props
 */
export type OwnPlatformPickerFieldContainerInput = EntityPickerFieldComponentInput;

/**
 * OwnPlatformPickerFieldContainer's props
 */
export type OwnPlatformPickerFieldContainerProps = OwnPlatformPickerFieldContainerInput;
