import { ErrorHandlerContainer } from 'app/components/containers/generic/error-handler';
import { AppNavigationContainer } from 'app/components/containers/navigation/app-navigator';
import { initializeRedux } from 'app/redux/initializer';
import React, { Component, ReactNode } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { config } from 'app/config/config';

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
					<StatusBar
						backgroundColor={config.ui.colors.colorPrimaryDark}
						barStyle='light-content'
					/>
					<AppNavigationContainer />
				</ErrorHandlerContainer>
			</Provider>
		);
	}
}

