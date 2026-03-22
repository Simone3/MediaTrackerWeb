import { Component, ReactNode } from 'react';
import { i18n } from 'app/utilities/i18n';

/**
 * Presentational component that contains the whole credits screen
 */
export class CreditsScreenComponent extends Component<CreditsScreenComponentProps> {
	/**
	 * @override
	 */
	public componentDidMount(): void {
		document.body.classList.add('app-dark-screen-active');
	}

	/**
	 * @override
	 */
	public componentWillUnmount(): void {
		document.body.classList.remove('app-dark-screen-active');
	}

	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<section className='credits-screen'>
				<div className='credits-shell'>
					<div className='credits-header'>
						<h1 className='credits-title'>{i18n.t('credits.screen.title')}</h1>
					</div>
					<div className='credits-grid'>
						<article className='credits-card'>
							<h2 className='credits-card-title'>The Movie Database (TMDb)</h2>
							<p className='credits-card-copy'>Movies and TV Shows data provided by TMDb. This product uses the TMDb API but is not endorsed or certified by TMDb.</p>
							<a href='https://www.themoviedb.org' target='_blank' rel='noreferrer' className='credits-link'>
								Visit TMDb
							</a>
						</article>
						<article className='credits-card'>
							<h2 className='credits-card-title'>Giant Bomb</h2>
							<p className='credits-card-copy'>Videogames data provided by Giant Bomb.</p>
							<a href='http://www.giantbomb.com' target='_blank' rel='noreferrer' className='credits-link'>
								Visit Giant Bomb
							</a>
						</article>
						<article className='credits-card'>
							<h2 className='credits-card-title'>Google Books</h2>
							<p className='credits-card-copy'>Books data provided by Google Books.</p>
							<a href='https://books.google.com' target='_blank' rel='noreferrer' className='credits-link'>
								Visit Google Books
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
