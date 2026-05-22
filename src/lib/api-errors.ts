/**
 * Shared error handling for API responses based on RFC 9457 (ProblemDetails).
 *
 * The backend returns validation errors with a body like:
 *   {
 *     "type":   "https://tools.ietf.org/html/rfc9110#section-15.5.1",
 *     "title":  "One or more validation errors occurred.",
 *     "status": 400,
 *     "errors": { "Field.Path": ["msg1", "msg2"], ... }
 *   }
 *
 * We never trust the HTTP status alone to decide whether a response follows
 * this contract: any non-OK response may or may not match the shape, so we
 * validate the body defensively before treating it as a ProblemDetails
 * validation payload.
 */

/**
 * Thrown when a response body matches the ProblemDetails validation shape.
 * Components can catch this specifically to render field-level feedback.
 */

type FieldErrors = Record<string, readonly string[]>;

export class ProblemDetailsError extends Error {
  public readonly fieldErrors: FieldErrors;
  constructor(fieldErrors: FieldErrors) {
    super("Validation failed");

    this.name = "ProblemDetailsError";
    this.fieldErrors = fieldErrors;
  }

  get messages(): string[] {
    return Object.values(this.fieldErrors).flat();
  }
}

/**
 * Returns the validation data if `body` matches the ProblemDetails shape
 * (object with an `errors` map whose values are arrays of strings).
 * Returns `null` for any other shape, including empty `errors` objects.
 *
 * Intentionally exported so it can be unit tested or reused without
 * triggering a throw.
 */
export function parseFieldErrors(body: unknown): FieldErrors | null {
  if (!body || typeof body !== "object") return null;
  if (!("errors" in body)) return null;
  const { errors } = body;

  if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
    return null;
  }
  const fieldErrors: FieldErrors = {};

  for (const [field, value] of Object.entries(
    errors as Record<string, unknown>,
  )) {
    if (!Array.isArray(value)) continue;
    const stringValues: string[] = [];
    for (const item of value) {
      if (typeof item !== "string") continue;
      stringValues.push(item);
    }
    if (stringValues.length === 0) continue;
    fieldErrors[field] = stringValues;
  }

  if (Object.keys(fieldErrors).length === 0) return null;

  return fieldErrors;
}

/**
 * Reads `response.body` once and throws either a `ProblemDetailsError`
 * (when the body matches the ProblemDetails validation contract) or a
 * generic `Error(fallbackMessage)` otherwise. Always throws.
 *
 * Call this only after `response.ok` is false. The body is consumed,
 * so the response cannot be read again afterwards.
 */
export async function throwApiError(
  response: Response,
  fallbackMessage: string,
): Promise<never> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Body was empty or not JSON. Fall through to the generic error.
  }

  const problems = parseFieldErrors(body);
  if (problems) {
    throw new ProblemDetailsError(problems);
  }

  throw new Error(fallbackMessage);
}
