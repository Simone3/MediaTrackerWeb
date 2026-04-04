import { FirebaseOptions, getApps, initializeApp } from 'firebase/app';
import { Auth, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { config } from 'app/config/config';
import { UserController } from 'app/controllers/interfaces/entities/user';
import { AppError } from 'app/data/models/internal/error';
import { UserInternal, UserSecretInternal } from 'app/data/models/internal/user';

const FIREBASE_APP_NAME = 'media-tracker-web';

const firebaseConfig: FirebaseOptions = config.firebase;

/**
 * Implementation of the UserController that uses the Firebase Web Auth SDK
 * @see UserController
 */
export class UserFirebaseController implements UserController {
	private authInitialization?: Promise<void>;

	private getAuthClient(): Auth {
		if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
			throw AppError.BACKEND_USER_LOGIN.withDetails('Missing Firebase web auth configuration. Set config.firebase.apiKey, config.firebase.authDomain, config.firebase.projectId, and config.firebase.appId');
		}

		const existingApp = getApps().find((app) => {
			return app.name === FIREBASE_APP_NAME;
		});

		const app = existingApp || initializeApp(firebaseConfig, FIREBASE_APP_NAME);
		return getAuth(app);
	}

	/**
	 * Firebase restores persisted auth state asynchronously in the browser.
	 * Wait for the first auth-state notification before reading currentUser.
	 * @param auth the Firebase auth client
	 * @returns the same auth client once initialization completes
	 */
	private async getInitializedAuthClient(auth: Auth = this.getAuthClient()): Promise<Auth> {
		if (this.authInitialization === undefined) {
			this.authInitialization = new Promise((resolve, reject) => {
				const unsubscribe = onAuthStateChanged(auth, () => {
					unsubscribe();
					resolve();
				}, (error) => {
					unsubscribe();
					reject(error);
				});
			});
		}

		await this.authInitialization;
		return auth;
	}

	/**
	 * @override
	 */
	public async getCurrentUser(): Promise<UserInternal | undefined> {
		const auth = await this.getInitializedAuthClient();
		const firebaseUser = auth.currentUser;
		if (firebaseUser) {
			return this.mapFirebaseUser(firebaseUser);
		}
		return undefined;
	}

	/**
	 * @override
	 */
	public async getCurrentUserAccessToken(): Promise<string> {
		const auth = await this.getInitializedAuthClient();
		const firebaseUser = auth.currentUser;
		if (!firebaseUser) {
			throw AppError.GENERIC.withDetails('Cannot get the access token if no user is logged in');
		}
		return firebaseUser.getIdToken();
	}

	/**
	 * @override
	 */
	public async signup(user: UserSecretInternal): Promise<UserInternal> {
		const auth = this.getAuthClient();
		const firebaseData = await createUserWithEmailAndPassword(auth, user.email, user.password);
		return this.mapFirebaseUser(firebaseData.user);
	}

	/**
	 * @override
	 */
	public async login(user: UserSecretInternal): Promise<UserInternal> {
		const auth = this.getAuthClient();
		const firebaseData = await signInWithEmailAndPassword(auth, user.email, user.password);
		return this.mapFirebaseUser(firebaseData.user);
	}

	/**
	 * @override
	 */
	public async logout(): Promise<void> {
		const auth = this.getAuthClient();
		await signOut(auth);
	}

	/**
	 * Helper to map user models
	 * @param firebaseUser the Firebase user model
	 * @returns the internal model
	 */
	private mapFirebaseUser(firebaseUser: User): UserInternal {
		const id = firebaseUser.uid;
		const email = firebaseUser.email;
		if (!email) {
			throw AppError.GENERIC.withDetails('Firebase user should always have an email');
		}

		return {
			id: id,
			email: email
		};
	}
}
