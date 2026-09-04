/**
 * Helper to measure how long an operation took, to be printed inline in the log message of the operation itself
 */
class ElapsedTime {
	/**
	 * Marks the start of an operation
	 * @returns the start timestamp, to be given back to {@link since}
	 */
	public start(): bigint {
		return process.hrtime.bigint();
	}

	/**
	 * Computes the time elapsed since the given start timestamp
	 * @param startNs the start timestamp returned by {@link start}
	 * @returns the elapsed time, formatted for a log message
	 */
	public since(startNs: bigint): string {
		const elapsedNs = process.hrtime.bigint() - startNs;
		return `${(Number(elapsedNs) / 1e6).toFixed(1)} ms`;
	}
}

/**
 * Singleton implementation of the elapsed time helper
 */
export const elapsedTime = new ElapsedTime();
