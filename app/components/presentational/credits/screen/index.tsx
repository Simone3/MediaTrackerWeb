import React, { Component, ReactNode } from 'react';
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
				<h1 className='credits-title'>{i18n.t('credits.screen.title')}</h1>
				<p className='credits-paragraph'>
					Movies and TV Shows data provided by{' '}
					<a href='https://www.themoviedb.org' target='_blank' rel='noreferrer' className='credits-link'>
						The Movie Database (TMDb)
					</a>{' '}
					(this product uses the TMDb API but is not endorsed or certified by TMDb).
				</p>
				<p className='credits-paragraph'>
					Videogames data provided by{' '}
					<a href='http://www.giantbomb.com' target='_blank' rel='noreferrer' className='credits-link'>
						Giant Bomb
					</a>.
				</p>
				<p className='credits-paragraph'>
					Books data provided by{' '}
					<a href='https://books.google.com' target='_blank' rel='noreferrer' className='credits-link'>
						Google Books
					</a>.
				</p>
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
