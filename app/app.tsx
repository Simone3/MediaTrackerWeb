import { Component, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ErrorHandlerContainer } from 'app/components/containers/generic/error-handler';
import { AppNavigationContainer } from 'app/components/containers/navigation/app-navigator';
import { initializeRedux } from 'app/redux/initializer';

// Initialize app components
const store = initializeRedux();

/**
 * App entry point
 */
export class App extends Component {
	/**
	 * @override
	 */
	public render(): ReactNode {
		return (
			<Provider store={store}>
				<ErrorHandlerContainer>
					<AppNavigationContainer />
				</ErrorHandlerContainer>
			</Provider>
		);
	}
}
