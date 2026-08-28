import { LenientParseResult } from 'app/utilities/helper-types';
import { ClassType, transformAndValidate, transformAndValidateSync, TransformValidationOptions } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';

/**
 * Common parser/validator that contains some util methods for extending classes
 */
class ParserValidator {
	/**
	 * Helper to parse and validate the given object against the given class (async)
	 * @param classType the class containing the object fields, with optional validation annotations
	 * @param source the source raw object
	 * @returns the parsed object, as a promise
	 * @template T the class to parse
	 */
	public parseAndValidate<T extends object>(classType: ClassType<T>, source: object): Promise<T> {
		return transformAndValidate(classType, source, this.getDefaultTransformValidationOptions());
	}

	/**
	 * Helper to parse and validate the given object array against the given class (async)
	 * @param classType the class containing the object fields, with optional validation annotations
	 * @param source the source raw object array
	 * @returns the parsed object array, as a promise
	 * @template T the class to parse
	 */
	public parseAndValidateList<T extends object>(classType: ClassType<T>, source: object[]): Promise<T[]> {
		return Promise.all(source.map((sourceItem) => {
			return this.parseAndValidate(classType, sourceItem);
		}));
	}

	/**
	 * Helper to parse and validate the given object against the given class, discarding the list items that
	 * failed validation instead of rejecting the whole object (async).
	 *
	 * A failure that does not belong to a list item (e.g. a missing required field of the object itself) still
	 * rejects: only the elements of a list can be dropped, and only if the object is valid without them.
	 * @param classType the class containing the object fields, with optional validation annotations
	 * @param source the source raw object
	 * @returns the parsed object and the number of discarded list items, as a promise
	 * @template T the class to parse
	 */
	public parseAndValidateDiscardingInvalidItems<T extends object>(classType: ClassType<T>, source: object): Promise<LenientParseResult<T>> {
		return this.parseAndValidate(classType, source)
			.then((value) => {
				return {
					value: value,
					discardedItems: 0
				};
			})
			.catch((error: unknown) => {
				if(!this.isValidationErrorList(error)) {
					return Promise.reject(error);
				}

				// Work on a copy: the caller may still need the original raw source (e.g. to log it)
				const prunedSource = JSON.parse(JSON.stringify(source));
				const discardedItems = this.discardInvalidItems(prunedSource, error);
				if(discardedItems <= 0) {
					return Promise.reject(error);
				}

				return this.parseAndValidate(classType, prunedSource)
					.then((value) => {
						return {
							value: value,
							discardedItems: discardedItems
						};
					});
			});
	}

	/**
	 * Helper to parse and validate the given object array against the given class, discarding the elements that
	 * failed validation instead of rejecting the whole array (async). Each element is in turn parsed with
	 * {@link parseAndValidateDiscardingInvalidItems}, so its own invalid list items are discarded as well.
	 * @param classType the class containing the object fields, with optional validation annotations
	 * @param source the source raw object array
	 * @returns the parsed object array and the number of discarded items, as a promise
	 * @template T the class to parse
	 */
	public parseAndValidateListDiscardingInvalid<T extends object>(classType: ClassType<T>, source: object[]): Promise<LenientParseResult<T[]>> {
		return Promise.all(source.map((sourceItem) => {
			return this.parseAndValidateDiscardingInvalidItems(classType, sourceItem)
				.catch(() => {
					return undefined;
				});
		})).then((results) => {
			const value: T[] = [];
			let discardedItems = 0;

			for(const result of results) {
				if(result) {
					value.push(result.value);
					discardedItems += result.discardedItems;
				}
				else {
					discardedItems += 1;
				}
			}

			return {
				value: value,
				discardedItems: discardedItems
			};
		});
	}

	/**
	 * Helper to parse and validate the given object against the given class /sync)
	 * @param classType the class containing the object fields, with optional validation annotations
	 * @param source the source raw object
	 * @returns the parsed object
	 * @template T the class to parse
	 */
	public parseAndValidateSync<T extends object>(classType: ClassType<T>, source: object): T {
		return transformAndValidateSync(classType, source, this.getDefaultTransformValidationOptions());
	}

	/**
	 * Helper to remove from the source the list items that failed validation, modifying it in place
	 * @param source the source value, modified in place
	 * @param errors the validation errors of the source value
	 * @returns the number of discarded items, or -1 if the errors cannot be fixed by discarding items
	 */
	private discardInvalidItems(source: unknown, errors: ValidationError[]): number {
		if(source instanceof Array) {
			return this.discardInvalidArrayItems(source, errors);
		}
		else if(source !== null && typeof source === 'object') {
			return this.discardInvalidObjectItems(source as { [key: string]: unknown }, errors);
		}
		else {
			return -1;
		}
	}

	/**
	 * Helper of {@link discardInvalidItems} for array values, where each validation error points at an element index
	 * @param source the source array, modified in place
	 * @param errors the validation errors of the source array
	 * @returns the number of discarded items, or -1 if the errors cannot be fixed by discarding items
	 */
	private discardInvalidArrayItems(source: unknown[], errors: ValidationError[]): number {
		const indexesToDiscard: number[] = [];
		let discardedItems = 0;

		for(const error of errors) {
			const index = Number(error.property);
			if(!Number.isInteger(index) || index < 0 || index >= source.length) {
				return -1;
			}

			// Try to fix the element itself before giving up on it, so that a single invalid genre does not discard the whole movie
			const nestedDiscardedItems = this.hasConstraints(error) ? -1 : this.discardInvalidItems(source[index], this.getChildren(error));
			if(nestedDiscardedItems > 0) {
				discardedItems += nestedDiscardedItems;
			}
			else {
				indexesToDiscard.push(index);
			}
		}

		for(const index of indexesToDiscard.sort((first, second) => {
			return second - first;
		})) {
			source.splice(index, 1);
		}

		return discardedItems + indexesToDiscard.length;
	}

	/**
	 * Helper of {@link discardInvalidItems} for object values, where each validation error points at a property
	 * @param source the source object, modified in place
	 * @param errors the validation errors of the source object
	 * @returns the number of discarded items, or -1 if the errors cannot be fixed by discarding items
	 */
	private discardInvalidObjectItems(source: { [key: string]: unknown }, errors: ValidationError[]): number {
		let discardedItems = 0;

		for(const error of errors) {
			const value = source[error.property];

			if(this.hasConstraints(error)) {
				// A constraint on the property itself (e.g. an "each" constraint on a list of primitives) does not say which
				// element failed: the whole list is dropped, and the following validation rejects if the model required it
				if(value instanceof Array) {
					Reflect.deleteProperty(source, error.property);
					discardedItems += value.length;
				}
				else {
					return -1;
				}
			}
			else {
				const nestedDiscardedItems = this.discardInvalidItems(value, this.getChildren(error));
				if(nestedDiscardedItems < 0) {
					return -1;
				}

				discardedItems += nestedDiscardedItems;
			}
		}

		return discardedItems;
	}

	/**
	 * Helper to get the nested validation errors of a validation error
	 * @param error the validation error
	 * @returns the nested validation errors, empty if none
	 */
	private getChildren(error: ValidationError): ValidationError[] {
		return error.children === undefined ? [] : error.children;
	}

	/**
	 * Helper to check if a generic error is a list of validation errors
	 * @param error the generic error
	 * @returns true if it's a non-empty list of validation errors
	 */
	private isValidationErrorList(error: unknown): error is ValidationError[] {
		return error instanceof Array && error.length > 0 && error.every((entry) => {
			return entry !== null && typeof entry === 'object' && typeof (entry as ValidationError).property === 'string';
		});
	}

	/**
	 * Helper to check if a validation error has constraints of its own, i.e. it did not fail only because of its children
	 * @param error the validation error
	 * @returns true if the error has at least one constraint
	 */
	private hasConstraints(error: ValidationError): boolean {
		return error.constraints !== undefined && Object.keys(error.constraints).length > 0;
	}

	/**
	 * Helper to get the transform-validation options
	 * @returns the transform-validation options
	 */
	private getDefaultTransformValidationOptions(): TransformValidationOptions {
		return {
			transformer: {
				strategy: 'exposeAll'
			},
			validator: {
				skipMissingProperties: false,
				forbidNonWhitelisted: true,
				forbidUnknownValues: true
			}
		};
	}
}

/**
 * Singleton instance of the parser/validator
 */
export const parserValidator = new ParserValidator();
