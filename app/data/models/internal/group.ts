/**
 * A media item group, internal type just for display purposes
 */
export type GroupInternal = {

	id: string;
	name: string;
}

/**
 * A filter for groups, internal type just for display purposes
 */
export type GroupFilterInternal = {

	name?: string;
}

/**
 * The default initial group, internal type just for display purposes
 */
export const DEFAULT_GROUP: GroupInternal = {
	id: '',
	name: ''
};
