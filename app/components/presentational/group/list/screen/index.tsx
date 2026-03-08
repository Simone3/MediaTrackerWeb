import React, { Component, ReactNode } from 'react';
import { View } from 'react-native';
import { GroupsListContainer } from 'app/components/containers/group/list/list';
import { styles } from 'app/components/presentational/group/list/screen/styles';
import { FABComponent } from 'app/components/presentational/generic/floating-action-button';
import { LoadingIndicatorComponent } from 'app/components/presentational/generic/loading-indicator';
import { i18n } from 'app/utilities/i18n';
import { GroupContextMenuContainer } from 'app/components/containers/group/list/context-menu';

/**
 * Presentational component that contains the whole "groups list" screen, that lists all user groups
 */
export class GroupsListScreenComponent extends Component<GroupsListScreenComponentInput & GroupsListScreenComponentOutput> {
	
	/**
	 * @override
	 */
	public componentDidMount(): void {

		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public componentDidUpdate(): void {

		this.requestFetchIfRequired();
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		
		return (
			<View style={styles.container}>
				<GroupsListContainer
					noneLabel={i18n.t('group.list.none')}
					emptyLabel={i18n.t('group.list.empty')}
					showRadioButtons={true}
				/>
				<GroupContextMenuContainer />
				<FABComponent
					text={'+'}
					onPress={() => {
						this.props.loadNewGroupDetails();
					}}
				/>
				<LoadingIndicatorComponent
					visible={this.props.isLoading}
					fullScreen={false}
				/>
			</View>
		);
	}

	/**
	 * Helper to invoke the fetch callback if the input fetch flag is true
	 */
	private requestFetchIfRequired(): void {
		
		if(this.props.requiresFetch) {

			this.props.fetchGroups();
		}
	}
}

/**
 * GroupsListScreenComponent's input props
 */
export type GroupsListScreenComponentInput = {
	
	/**
	 * Flag to tell if the component is currently waiting on an async operation. If true, shows the loading screen.
	 */
	isLoading: boolean;

	/**
	 * Flag to tell if the groups list requires a fetch. If so, on startup or on update the component will invoke the fetch callback.
	 */
	requiresFetch: boolean;
}

/**
 * GroupsListScreenComponent's output props
 */
export type GroupsListScreenComponentOutput = {

	/**
	 * Callback to request the groups list (re)load
	 */
	fetchGroups: () => void;

	/**
	 * Callback to load the details of a new group
	 */
	loadNewGroupDetails: () => void;
}
