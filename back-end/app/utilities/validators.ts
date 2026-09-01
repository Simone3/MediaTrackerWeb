import { dateUtils } from 'app/utilities/date-utils';
import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Custom class-validator decorator that checks that a property is a time zone the runtime knows, i.e. an IANA
 * identifier such as 'Europe/Rome' or a UTC offset such as '+02:00'. class-validator has no such constraint of its
 * own, and the alternative is letting an unknown time zone reach the database and fail there, where the error says
 * nothing about which request field was wrong
 * @param validationOptions the standard class-validator options
 * @returns the property decorator
 */
export const IsTimeZone = (validationOptions?: ValidationOptions): PropertyDecorator => {
	return (target: object, propertyName: string | symbol): void => {
		registerDecorator({
			name: 'isTimeZone',
			target: target.constructor,
			propertyName: String(propertyName),
			options: validationOptions,
			validator: {
				validate(value: unknown): boolean {
					return typeof value === 'string' && dateUtils.isValidTimeZone(value);
				},

				defaultMessage(): string {
					return '$property must be a valid time zone';
				}
			}
		});
	};
};
