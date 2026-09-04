import { ReactElement } from 'react';
import { ClearableInputComponent } from 'app/components/presentational/generic/clearable-input';

/**
 * Shared search bar of the entity management screens, that filters their list client-side.
 * @param props the input props
 * @returns the component
 */
export const EntitySearchBarComponent = (props: EntitySearchBarComponentProps): ReactElement => {
	return (
		<div className='entity-search-bar' role='search'>
			<ClearableInputComponent
				id={props.id}
				type='search'
				value={props.value}
				placeholder={props.placeholder}
				aria-label={props.placeholder}
				containerClassName='entity-search-bar-input'
				showClearButton={Boolean(props.value)}
				onChangeValue={props.onChangeValue}
				onClear={() => {
					props.onChangeValue('');
				}}
			/>
		</div>
	);
};

export type EntitySearchBarComponentProps = {
	id: string;
	value: string;
	placeholder: string;
	onChangeValue: (value: string) => void;
};
