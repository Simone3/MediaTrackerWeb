import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { GroupFormContainer } from 'app/components/containers/group/details/form';
import { styles } from 'app/components/presentational/group/details/screen/styles';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';

/**
 * Presentational component that contains the whole "group details" screen, that works as the "add new group", "update group" and
 * "view group data" sections
 */
export class GroupDetailsScreenComponent extends Component<GroupDetailsScreenComponentInput & GroupDetailsScreenComponentOutput> {
	
	/**
	 * @override
	 */
	public render(): ReactNode {
	
		return (
			<View style={styles.container}>
				<GroupFormContainer/>
				<LoadingIndicatorComponent
					visible={this.props.isLoading}
					fullScreen={false}
				/>
			</View>
		);
	}
}

/**
 * GroupDetailsScreenComponent's input props
 */
export type GroupDetailsScreenComponentInput = {

	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;
}

/**
 * GroupDetailsScreenComponent's output props
 */
export type GroupDetailsScreenComponentOutput = {

}
