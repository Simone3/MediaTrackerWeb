import { localStorage } from 'app/controllers/core/common/local-storage';
import { UserController } from 'app/controllers/core/entities/user';
import { MockControllerHelper } from 'app/controllers/impl-mocks/common/mock-helper';
import { AppError } from 'app/data/models/internal/error';
import { UserInternal, UserSecretInternal } from 'app/data/models/internal/user';

/**
 * Mocked implementation of the UserController that contains an in-memory list of users
 * @see UserController
 */
export class UserMockedController extends MockControllerHelper implements UserController {

	private static readonly LOCAL_STORAGE_KEY = 'mocked-user';

	protected delay = 0;
	protected errorProbability = 0;

	protected readonly users: UserInternal[] = [{
		id: 'test',
		email: 'test@test.test'
	}];

	/**
	 * @override
	 */
	public async getCurrentUser(): Promise<UserInternal | undefined> {

		const value = await localStorage.getValue(UserMockedController.LOCAL_STORAGE_KEY);
		return value ? JSON.parse(value) : undefined;
	}

	/**
	 * @override
	 */
	public async getCurrentUserAccessToken(): Promise<string> {

		const user = await this.getCurrentUser();
		if(!user) {

			throw AppError.GENERIC.withDetails('Cannot get the access token if no user is logged in');
		}
		return '-fake-access-token-';
	}

	/**
	 * @override
	 */
	public async signup(user: UserSecretInternal): Promise<UserInternal> {

		return this.resolveResult(async() => {

			const sameNameUser = this.users.find((existingUser) => {
				return existingUser.email === user.email;
			});
			if(sameNameUser) {

				throw AppError.BACKEND_USER_SIGNUP.withDetails('Mocked user with same name already exists');
			}
			
			const newUser = {
				...user,
				id: this.randomId()
			};
			
			this.users.push(newUser);

			await localStorage.setValue(UserMockedController.LOCAL_STORAGE_KEY, JSON.stringify(newUser));
			
			return newUser;
		});
	}
	
	/**
	 * @override
	 */
	public async login(user: UserSecretInternal): Promise<UserInternal> {

		return this.resolveResult(async() => {

			const matchingUser = this.users.find((existingUser) => {
				return existingUser.email === user.email;
			});

			if(!matchingUser) {

				throw AppError.BACKEND_USER_LOGIN.withDetails('No matching mocked user');
			}

			await localStorage.setValue(UserMockedController.LOCAL_STORAGE_KEY, JSON.stringify(matchingUser));
			
			return matchingUser;
		});
	}

	/**
	 * @override
	 */
	public async logout(): Promise<void> {

		localStorage.removeValue(UserMockedController.LOCAL_STORAGE_KEY);
	}
}
