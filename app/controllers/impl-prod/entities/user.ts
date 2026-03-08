import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { UserController } from 'app/controllers/core/entities/user';
import { AppError } from 'app/data/models/internal/error';
import { UserInternal, UserSecretInternal } from 'app/data/models/internal/user';

/**
 * Implementation of the UserController that uses the Firebase API
 * @see UserController
 */
export class UserFirebaseController implements UserController {

	/**
	 * @override
	 */
	public async getCurrentUser(): Promise<UserInternal | undefined> {

		const firebaseUser = auth().currentUser;
		if(firebaseUser) {

			return this.mapFirebaseUser(firebaseUser);
		}
		else {

			return undefined;
		}
	}

	/**
	 * @override
	 */
	public async getCurrentUserAccessToken(): Promise<string> {

		const firebaseUser = auth().currentUser;
		if(!firebaseUser) {

			throw AppError.GENERIC.withDetails('Cannot get the access token if no user is logged in');
		}
		return firebaseUser.getIdToken();
	}

	/**
	 * @override
	 */
	public async signup(user: UserSecretInternal): Promise<UserInternal> {

		const firebaseData = await auth().createUserWithEmailAndPassword(user.email, user.password);
		return this.mapFirebaseUser(firebaseData.user);
	}
	
	/**
	 * @override
	 */
	public async login(user: UserSecretInternal): Promise<UserInternal> {

		const firebaseData = await auth().signInWithEmailAndPassword(user.email, user.password);
		return this.mapFirebaseUser(firebaseData.user);
	}

	/**
	 * @override
	 */
	public async logout(): Promise<void> {

		await auth().signOut();
	}

	/**
	 * Helper to map user models
	 * @param firebaseUser the Firebase user model
	 * @returns the internal model
	 */
	private mapFirebaseUser(firebaseUser: FirebaseAuthTypes.User): UserInternal {

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
