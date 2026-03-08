import { CommonActions } from '@react-navigation/native';
import { Navigation } from 'app/components/containers/navigation/global';
import { AppError } from 'app/data/models/internal/error';

/**
 * Global class that can be used anywhere to navigate to a different app screen
 */
class NavigationService {

	private navigator?: Navigation;

	/**
	 * To be used ONLY by the top-level React Navigation component to save the navigator reference
	 * @param navigator the navigator reference
	 */
	public initialize(navigator: Navigation): void {
		
		this.navigator = navigator;
	}

	/**
	 * Navigates to the given screen
	 * @param routeName the screen name
	 * @param params the optional screen parameters
	 */
	public navigate(routeName: string, params?: object): void {

		if(!this.navigator) {

			throw AppError.GENERIC.withDetails('Navigation service was not initialized');
		}

		this.navigator.dispatch(
			CommonActions.navigate({
				name: routeName,
				params
			})
		);
	}

	/**
	 * Navigates back the stack
	 */
	public back(): void {

		if(!this.navigator) {

			throw AppError.GENERIC.withDetails('Navigation service was not initialized');
		}

		this.navigator.dispatch(
			CommonActions.goBack()
		);
	}

	/**
	 * Sets a navigation param
	 * @param route the route where to set the param
	 * @param key the param key
	 * @param value the param value
	 */
	public setParam(route: string, key: string, value: unknown): void {

		if(!this.navigator) {

			throw AppError.GENERIC.withDetails('Navigation service was not initialized');
		}

		this.navigator.dispatch(
			CommonActions.setParams({
				key: route,
				params: {
					[key]: value
				}
			})
		);
	}
}

/**
 * Singleton implementation of the navigation service
 */
export const navigationService = new NavigationService();
