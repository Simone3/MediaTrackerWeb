import { AppError } from 'app/data/models/internal/error';

/**
 * Simple abstract class that offers some utility methods to mock controllers
 */
export abstract class MockControllerHelper {

	/**
	 * Result delay in milliseconds, can be overridden by implementations
	 */
	protected delay = 0;

	/**
	 * Result error probability [0, 1], can be overridden by implementations
	 */
	protected errorProbability = 0;

	/**
	 * Helper to return a result with the configured delay and with the configured error probability
	 * @param successResultCallback the callback that produces the mocked result
	 * @returns the promise of the mocked result
	 */
	protected resolveResult<T>(successResultCallback: () => T): Promise<T> {

		const prob = this.errorProbability;
		if(prob < 0 || prob > 1) {

			throw AppError.GENERIC.withDetails('Mocked controller error probability must be [0, 1]');
		}
		const isError = Math.random() < prob;
		
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				
				if(isError) {

					reject('Mocked error');
				}
				else {

					resolve(successResultCallback());
				}
				
			}, this.delay);
		});
	}

	/**
	 * Builds a random ID
	 * @returns the ID
	 */
	protected randomId(): string {

		return String(100 + Math.floor(Math.random() * 10000000001));
	}
}
