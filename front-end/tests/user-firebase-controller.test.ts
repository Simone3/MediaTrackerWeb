import { UserFirebaseController } from 'app/controllers/implementations/real/entities/user';

jest.mock('app/config/config', () => {
	return {
		config: {
			firebase: {
				apiKey: 'test-api-key',
				authDomain: 'test-auth-domain',
				projectId: 'test-project-id',
				appId: 'test-app-id'
			}
		}
	};
});

jest.mock('firebase/app', () => {
	return {
		getApps: jest.fn(),
		initializeApp: jest.fn()
	};
});

jest.mock('firebase/auth', () => {
	return {
		createUserWithEmailAndPassword: jest.fn(),
		getAuth: jest.fn(),
		onAuthStateChanged: jest.fn(),
		signInWithEmailAndPassword: jest.fn(),
		signOut: jest.fn()
	};
});

const firebaseAppMock = jest.requireMock('firebase/app');
const firebaseAuthMock = jest.requireMock('firebase/auth');

describe('UserFirebaseController', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		firebaseAppMock.getApps.mockReturnValue([]);
		firebaseAppMock.initializeApp.mockReturnValue({ name: 'firebase-app' });
	});

	it('waits for Firebase auth initialization before reading the access token', async() => {
		const getIdTokenMock = jest.fn().mockResolvedValue('token-123');
		const auth = {
			currentUser: null as unknown
		};

		firebaseAuthMock.getAuth.mockReturnValue(auth);
		firebaseAuthMock.onAuthStateChanged.mockImplementation((_auth, next) => {
			Promise.resolve().then(() => {
				auth.currentUser = {
					uid: 'user-id',
					email: 'user@example.com',
					getIdToken: getIdTokenMock
				};
				next(auth.currentUser);
			});

			return jest.fn();
		});

		const controller = new UserFirebaseController();

		await expect(controller.getCurrentUserAccessToken()).resolves.toBe('token-123');
		expect(firebaseAuthMock.onAuthStateChanged).toHaveBeenCalledTimes(1);
		expect(getIdTokenMock).toHaveBeenCalledTimes(1);
	});

	it('returns undefined when Firebase auth initializes without a persisted user', async() => {
		const auth = {
			currentUser: null
		};

		firebaseAuthMock.getAuth.mockReturnValue(auth);
		firebaseAuthMock.onAuthStateChanged.mockImplementation((_auth, next) => {
			Promise.resolve().then(() => {
				next(null);
			});

			return jest.fn();
		});

		const controller = new UserFirebaseController();

		await expect(controller.getCurrentUser()).resolves.toBeUndefined();
		expect(firebaseAuthMock.onAuthStateChanged).toHaveBeenCalledTimes(1);
	});
});
