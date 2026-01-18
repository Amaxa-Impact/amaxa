/**
 * @deprecated Use Result from 'better-result' instead.
 * This file is kept for backward compatibility but should not be used in new code.
 *
 * Migration guide:
 *
 * Before:
 * ```typescript
 * const result = await tryCatch(somePromise);
 * if (result.error) {
 *   // handle error
 * }
 * ```
 *
 * After:
 * ```typescript
 * import { Result } from 'better-result';
 *
 * const result = await Result.tryPromise({
 *   try: async () => await somePromise,
 *   catch: (e) => new YourError({ message: String(e), cause: e })
 * });
 *
 * if (Result.isErr(result)) {
 *   // handle result.error
 * }
 * ```
 */

// Types for the result object with discriminated union
interface Success<T> {
  data: T;
  error: null;
}

interface Failure<E> {
  data: null;
  error: E;
}

type Result<T, E = Error> = Success<T> | Failure<E>;

// Main wrapper function
export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
