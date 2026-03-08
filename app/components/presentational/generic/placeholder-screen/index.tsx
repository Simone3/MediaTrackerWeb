import React from 'react';

/**
 * Simple placeholder screen for routes not migrated yet
 * @param props component input props
 * @returns rendered placeholder section
 */
export const PlaceholderScreenComponent = (props: PlaceholderScreenComponentProps): React.ReactElement => {
	const {
		title,
		message
	} = props;

	return (
		<section className='placeholder-screen'>
			<h1 className='placeholder-screen-title'>{title}</h1>
			<p className='placeholder-screen-message'>{message}</p>
		</section>
	);
};

/**
 * PlaceholderScreenComponent input props
 */
export type PlaceholderScreenComponentProps = {
	title: string;
	message: string;
};
