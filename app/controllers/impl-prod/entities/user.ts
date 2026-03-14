import { config } from 'app/config/config';
import { UserController } from 'app/controllers/core/entities/user';
import { AppError } from 'app/data/models/internal/error';
import { UserInternal, UserSecretInternal } from 'app/data/models/internal/user';
import { FirebaseOptions, getApps, initializeApp } from 'firebase/app';
import { Auth, User, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const FIREBASE_APP_NAME = 'media-tracker-web';

const firebaseConfig: FirebaseOptions = config.firebase;

/**
 * Implementation of the UserController that uses the Firebase Web Auth SDK
 * @see UserController
 */
export class UserFirebaseController implements UserController {
	private getAuthClient(): Auth {
		if(!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.appId) {
			throw AppError.BACKEND_USER_LOGIN.withDetails('Missing Firebase web auth configuration. Set config.firebase.apiKey, config.firebase.authDomain, config.firebase.projectId, and config.firebase.appId');
		}

		const existingApp = getApps().find((app) => {
			return app.name === FIREBASE_APP_NAME;
		});

		const app = existingApp || initializeApp(firebaseConfig, FIREBASE_APP_NAME);
		return getAuth(app);
	}

	/**
	 * @override
	 */
	public async getCurrentUser(): Promise<UserInternal | undefined> {
		const firebaseUser = this.getAuthClient().currentUser;
		if(firebaseUser) {
			return this.mapFirebaseUser(firebaseUser);
		}
		return undefined;
	}

	/**
	 * @override
	 */
	public async getCurrentUserAccessToken(): Promise<string> {
		const firebaseUser = this.getAuthClient().currentUser;
		if(!firebaseUser) {
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
		if(!email) {
			throw AppError.GENERIC.withDetails('Firebase user should always have an email');
		}

		return {
			id: id,
			email: email
		};
	}
}
