import { screenToPath } from 'app/utilities/navigation-routes';
import { AppScreens } from 'app/utilities/screens';

describe('navigation routes', () => {
	test('maps known screens to paths', () => {
		expect(screenToPath(AppScreens.UserLogin)).toBe('/auth/login');
		expect(screenToPath(AppScreens.CategoriesList)).toBe('/media/categories');
		expect(screenToPath(AppScreens.Settings)).toBe('/settings');
	});

	test('throws for unknown screens', () => {
		expect(() => {
			screenToPath('UnknownScreen');
		}).toThrow('Route UnknownScreen has no mapped web path');
	});
});
