import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreditsScreenComponent } from 'app/components/presentational/credits/screen';

describe('CreditsScreenComponent', () => {
	test('renders source cards with external links', () => {
		const { unmount } = render(
			<CreditsScreenComponent />
		);

		expect(document.body).toHaveClass('app-dark-screen-active');
		expect(screen.getByRole('heading', { name: 'Credits' })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Visit TMDb' })).toHaveAttribute('href', 'https://www.themoviedb.org');
		expect(screen.getByRole('link', { name: 'Visit Giant Bomb' })).toHaveAttribute('href', 'http://www.giantbomb.com');
		expect(screen.getByRole('link', { name: 'Visit Google Books' })).toHaveAttribute('href', 'https://books.google.com');

		unmount();
		expect(document.body).not.toHaveClass('app-dark-screen-active');
	});
});
