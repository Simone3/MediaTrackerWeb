import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CreditsScreenComponent } from 'app/components/presentational/credits/screen';
import { i18n } from 'app/utilities/i18n';

describe('CreditsScreenComponent', () => {
	test('renders source cards with external links', () => {
		render(
			<MemoryRouter>
				<CreditsScreenComponent />
			</MemoryRouter>
		);

		expect(screen.getByRole('heading', { name: i18n.t('credits.screen.title') })).toBeInTheDocument();
		expect(screen.getByRole('link', { name: i18n.t('credits.screen.cards.tmdb.link') })).toHaveAttribute('href', 'https://www.themoviedb.org');
		expect(screen.getByRole('link', { name: i18n.t('credits.screen.cards.giantBomb.link') })).toHaveAttribute('href', 'http://www.giantbomb.com');
		expect(screen.getByRole('link', { name: i18n.t('credits.screen.cards.googleBooks.link') })).toHaveAttribute('href', 'https://books.google.com');
	});
});
