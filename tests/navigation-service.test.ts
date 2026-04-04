import { navigationService, Navigation } from 'app/utilities/navigation-service';
import { AppScreens } from 'app/utilities/screens';

type MutableNavigationService = {
	initialize: (navigator: Navigation) => void;
	navigate: (routeName: string) => void;
	back: () => void;
	setParam: (route: string, key: string, value: unknown) => void;
	navigator?: Navigation;
};

describe('navigationService', () => {
	const mutableNavigationService = navigationService as unknown as MutableNavigationService;

	beforeEach(() => {
		mutableNavigationService.navigator = undefined;
		jest.restoreAllMocks();
	});

	test('navigates with the mapped browser path after initialization', () => {
		const navigate = jest.fn();

		mutableNavigationService.initialize({
			navigate: navigate,
			back: jest.fn()
		});

		mutableNavigationService.navigate(AppScreens.MediaItemDetails);

		expect(navigate).toHaveBeenCalledWith('/media/items/details');
	});

	test('throws a descriptive error when navigate is called before initialization', () => {
		expect(() => {
			mutableNavigationService.navigate(AppScreens.Settings);
		}).toThrow('Navigation service was not initialized');
	});

	test('delegates back navigation to the active navigator', () => {
		const back = jest.fn();

		mutableNavigationService.initialize({
			navigate: jest.fn(),
			back: back
		});

		mutableNavigationService.back();

		expect(back).toHaveBeenCalledTimes(1);
	});

	test('keeps setParam as a logged no-op on web', () => {
		const debugSpy = jest.spyOn(console, 'debug').mockImplementation((): void => {});

		mutableNavigationService.setParam('/media/items', 'sortBy', 'NAME');

		expect(debugSpy).toHaveBeenCalledWith(
			'navigationService.setParam is not implemented on web yet',
			'/media/items',
			'sortBy',
			'NAME'
		);
	});
});
