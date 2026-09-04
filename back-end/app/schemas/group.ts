import { CATEGORY_COLLECTION_NAME } from 'app/schemas/category';
import { DATABASE_COLLATION } from 'app/schemas/common';
import { Schema } from 'mongoose';

/**
 * Database schema for groups
 */
export const GroupSchema: Schema = new Schema({
	name: { type: String, required: true },
	owner: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: CATEGORY_COLLECTION_NAME, required: true }
}, {
	timestamps: true
});

/**
 * Every group read is scoped to an owner and a category and ordered by name, and the category delete cascade filters
 * on the same two fields, so without this index each of them scans the groups of EVERY user: this cost grows with the
 * number of registered users rather than with how much one of them entered. The English collation is required for the
 * queries that run under it to be able to use the index
 */
GroupSchema.index({ owner: 1, category: 1, name: 1 }, { collation: DATABASE_COLLATION });

/**
 * Groups collection name
 */
export const GROUP_COLLECTION_NAME = 'Group';
