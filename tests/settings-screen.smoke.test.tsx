import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsScreenComponent } from 'app/components/presentational/settings/screen';

describe('SettingsScreenComponent', () => {
	test('supports logout and old app import confirmation flow', async() => {
		const logout = jest.fn();
		const importOldAppExport = jest.fn();
		const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
		const originalCreateObjectUrl = URL.createObjectURL;
		const originalRevokeObjectUrl = URL.revokeObjectURL;
		const createObjectUrlMock = jest.fn().mockReturnValue('blob:test-old-export');
		const revokeObjectUrlMock = jest.fn();

		Object.defineProperty(URL, 'createObjectURL', {
			writable: true,
			value: createObjectUrlMock
		});
		Object.defineProperty(URL, 'revokeObjectURL', {
			writable: true,
			value: revokeObjectUrlMock
		});

		const { container } = render(
			<SettingsScreenComponent
				user={{
					id: 'user-id',
					email: 'test@example.com'
				}}
				isLoading={false}
				logout={logout}
				importOldAppExport={importOldAppExport}
			/>
		);

		const user = userEvent.setup();
		await user.click(screen.getByRole('button', { name: /Logout/i }));
		expect(logout).toHaveBeenCalledTimes(1);

		await user.click(screen.getByRole('button', { name: /Import previous app version data/i }));
		const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
		await user.upload(fileInput, new File([ '{}' ], 'old-export.json', { type: 'application/json' }));

		expect(importOldAppExport).toHaveBeenCalledWith('blob:test-old-export');
		expect(confirmSpy).toHaveBeenCalledTimes(3);

		Object.defineProperty(URL, 'createObjectURL', {
			writable: true,
			value: originalCreateObjectUrl
		});
		Object.defineProperty(URL, 'revokeObjectURL', {
			writable: true,
			value: originalRevokeObjectUrl
		});
		confirmSpy.mockRestore();
	});
});
