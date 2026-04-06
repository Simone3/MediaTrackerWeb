import { Component, ReactNode } from 'react';
import { AuthenticatedPageHeaderComponent } from 'app/components/presentational/generic/authenticated-page-header';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole credits screen
 */
export class CreditsScreenComponent extends Component<CreditsScreenComponentProps> {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<section className='credits-screen'>
				<div className='credits-shell'>
					<AuthenticatedPageHeaderComponent title={i18n.t('credits.screen.title')} />
					<div className='credits-grid'>
						<article className='credits-card'>
							<h2 className='credits-card-title'>{i18n.t('credits.screen.cards.tmdb.title')}</h2>
							<p className='credits-card-copy'>{i18n.t('credits.screen.cards.tmdb.copy')}</p>
							<a href='https://www.themoviedb.org' target='_blank' rel='noreferrer' className='credits-link'>
								{i18n.t('credits.screen.cards.tmdb.link')}
							</a>
						</article>
						<article className='credits-card'>
							<h2 className='credits-card-title'>{i18n.t('credits.screen.cards.giantBomb.title')}</h2>
							<p className='credits-card-copy'>{i18n.t('credits.screen.cards.giantBomb.copy')}</p>
							<a href='http://www.giantbomb.com' target='_blank' rel='noreferrer' className='credits-link'>
								{i18n.t('credits.screen.cards.giantBomb.link')}
							</a>
						</article>
						<article className='credits-card'>
							<h2 className='credits-card-title'>{i18n.t('credits.screen.cards.googleBooks.title')}</h2>
							<p className='credits-card-copy'>{i18n.t('credits.screen.cards.googleBooks.copy')}</p>
							<a href='https://books.google.com' target='_blank' rel='noreferrer' className='credits-link'>
								{i18n.t('credits.screen.cards.googleBooks.link')}
							</a>
						</article>
					</div>
				</div>
			</section>
		);
	}
}

/**
 * CreditsScreenComponent's input props
 */
export type CreditsScreenComponentInput = Record<string, never>;

/**
 * CreditsScreenComponent's output props
 */
export type CreditsScreenComponentOutput = Record<string, never>;

/**
 * CreditsScreenComponent's props
 */
export type CreditsScreenComponentProps = CreditsScreenComponentInput & CreditsScreenComponentOutput;
