import React, { Component, ReactElement, ReactNode } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { styles } from 'app/components/presentational/generic/selection-list/styles';
import { SelectionRowComponent } from 'app/components/presentational/generic/selection-row';
import { config } from 'app/config/config';

/**
 * Presentational component to display a generic selection list, with radio buttons and context menu
 */
export class SelectionListComponent<E extends SelectionListEntity> extends Component<SelectionListComponentProps<E>, SelectionListComponentState> {
	
	private static readonly NONE_ID = 'SelectionListComponent.None';

	public state: SelectionListComponentState = { enabled: true };

	/**
	 * @override
	 */
	public render(): ReactNode {

		return this.renderList();
	}

	/**
	 * Helper method to render the no entities message
	 * @returns the node portion
	 */
	private renderEmptyList(): ReactElement {

		const {
			emptyLabel
		} = this.props;

		return <Text style={styles.emptyMessage}>{emptyLabel}</Text>;
	}

	/**
	 * Helper method to render entities list
	 * @returns the node portion
	 */
	private renderList(): ReactNode {

		const {
			entities,
			currentEntity,
			noneLabel,
			showRadioButtons,
			selectRow,
			highlightRow,
			refreshEntities
		} = this.props;

		let entitiesToDisplay = entities;
		if(noneLabel) {

			entitiesToDisplay = [ {
				id: SelectionListComponent.NONE_ID,
				name: noneLabel
			} as E ].concat(entities);
		}

		return (
			<View style={styles.container}>
				<FlatList
					style={styles.list}
					contentContainerStyle={styles.listContentContainer}
					data={entitiesToDisplay}
					refreshControl={
						<RefreshControl
							refreshing={false}
							onRefresh={refreshEntities}
							colors={[ config.ui.colors.colorPrimaryDark ]}
							tintColor={config.ui.colors.colorPrimaryDark}
						/>
					}
					ListEmptyComponent={this.renderEmptyList()}
					renderItem={({ item }) => {
						return (
							<SelectionRowComponent
								label={item.name}
								selected={Boolean((currentEntity && item.id === currentEntity.id) || (!currentEntity && item.id === SelectionListComponent.NONE_ID))}
								showRadioButton={showRadioButtons}
								enabled={this.state.enabled}
								select={() => {

									// Disable all rows to avoid double tapping and then send the callback
									this.setState({ enabled: false });
									selectRow(item.id === SelectionListComponent.NONE_ID ? undefined : item);
								}}
								openOptionsMenu={
									item.id === SelectionListComponent.NONE_ID ?
										undefined :
										() => {
											highlightRow(item);
										}}
							/>
						);
					}}
					keyExtractor={(item) => {
						return item.id;
					}}
				/>
			</View>
		);
	}
}

/**
 * SelectionListComponent's input props
 */
export type SelectionListComponentInput<E extends SelectionListEntity> = {

	/**
	 * The entities list to be displayed
	 */
	entities: E[];

	/**
	 * If not empty, the list will always have a "None" element with this label at the beginning
	 */
	noneLabel?: string;

	/**
	 * Message to display if the list is empty. Note that if "noneLabel" is specified, the list can never be empty.
	 */
	emptyLabel?: string;

	/**
	 * If true, the list will show a radio button for each entity
	 */
	showRadioButtons?: boolean;

	/**
	 * To be used together with showRadioButtons to define the currently selected entity. Undefined means "None", if present.
	 */
	currentEntity?: E;
}

/**
 * SelectionListComponent's output props
 */
export type SelectionListComponentOutput<E extends SelectionListEntity> = {

	/**
	 * Callback to select a row (i.e. click on a list item). Undefined means "None", if present.
	 */
	selectRow: (entity: E | undefined) => void;

	/**
	 * Callback to set a row as highlighted, e.g. to open its dialog menu
	 */
	highlightRow: (entity: E) => void;

	/**
	 * Callback to relead the entities list
	 */
	refreshEntities: () => void;
}

/**
 * SelectionListComponent's props
 */
export type SelectionListComponentProps<E extends SelectionListEntity> = SelectionListComponentInput<E> & SelectionListComponentOutput<E>;

/**
 * SelectionListComponent's entity
 */
type SelectionListEntity = {

	id: string;
	name: string;
}

/**
 * SelectionListComponent's state
 */
type SelectionListComponentState = {

	/**
	 * If selection is enabled
	 */
	enabled: boolean
};
