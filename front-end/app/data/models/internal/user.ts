/**
 * A user, internal type just for display purposes
 */
export type UserInternal = {

	id: string;
	email: string;
};

/**
 * A user with secret data (objects of this type are meant to be transient), internal type just for display purposes
 */
export type UserSecretInternal = {

	email: string;
	password: string;
};
