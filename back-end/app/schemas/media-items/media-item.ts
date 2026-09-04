import { CATEGORY_COLLECTION_NAME } from 'app/schemas/category';
import { DATABASE_COLLATION } from 'app/schemas/common';
import { GROUP_COLLECTION_NAME } from 'app/schemas/group';
import { OWN_PLATFORM_COLLECTION_NAME } from 'app/schemas/own-platform';
import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';

/**
 * Common schema definition for a generic media item
 */
export const commonMediaItemSchemaDefinition: SchemaDefinition = {
	name: { type: String, required: true },
	owner: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: CATEGORY_COLLECTION_NAME, required: true },
	group: { type: Schema.Types.ObjectId, ref: GROUP_COLLECTION_NAME, required: false },
	ownPlatform: { type: Schema.Types.ObjectId, ref: OWN_PLATFORM_COLLECTION_NAME, required: false },
	orderInGroup: { type: Number, required: false },
	importance: { type: String, required: true },
	genres: { type: [ String ], required: false },
	description: { type: String, required: false },
	userComment: { type: String, required: false },
	completedOn: { type: [ Date ], required: false },
	completedLastOn: { type: Date, required: false },
	releaseDate: { type: Date, required: false },
	active: { type: Boolean, required: false },
	markedAsRedo: { type: Boolean, required: false },
	catalogId: { type: String, required: false },
	imageUrl: { type: String, required: false }
};

/**
 * Common schema options for a generic media item
 */
export const commonMediaItemSchemaOptions: SchemaOptions = {
	timestamps: true
};

/**
 * Adds to a media item schema the indexes shared by every media type. Every media-item read is scoped to an owner and,
 * in all but the "delete everything for a user" cascade, to a category: without this index each of them is a full
 * collection scan. The English collation is required for the queries that run under it to be able to use the index
 * @param schema the media type schema
 */
export const addCommonMediaItemSchemaIndexes = (schema: Schema): void => {
	schema.index({ owner: 1, category: 1 }, { collation: DATABASE_COLLATION });
};
