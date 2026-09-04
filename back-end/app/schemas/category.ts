import { INTERNAL_MEDIA_TYPES } from 'app/data/models/internal/category';
import { DATABASE_COLLATION } from 'app/schemas/common';
import { Schema } from 'mongoose';

/**
 * Database schema for categories
 */
export const CategorySchema: Schema = new Schema({
	name: { type: String, required: true },
	owner: { type: String, required: true },
	mediaType: { type: String, enum: INTERNAL_MEDIA_TYPES, required: true },
	color: { type: String, required: true }
}, {
	timestamps: true
});

/**
 * Every category read is scoped to an owner and ordered by name, so without this index each of them scans and sorts
 * the categories of EVERY user: this cost grows with the number of registered users rather than with how much one of
 * them entered. The English collation is required for the queries that run under it to be able to use the index
 */
CategorySchema.index({ owner: 1, name: 1 }, { collation: DATABASE_COLLATION });

/**
 * Categories collection name
 */
export const CATEGORY_COLLECTION_NAME = 'Category';
