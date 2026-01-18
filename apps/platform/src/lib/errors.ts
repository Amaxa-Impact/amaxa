import { TaggedError } from "better-result";

export class JsonParseError extends TaggedError("JsonParseError")<{
  message: string;
  input?: unknown;
  cause?: unknown;
}>() {}

export class ValidationError extends TaggedError("ValidationError")<{
  message: string;
  errors: string;
  input?: unknown;
}>() {}

export class S3Error extends TaggedError("S3Error")<{
  message: string;
  operation: "upload" | "download" | "presign";
  key?: string;
  cause?: unknown;
}>() {}

export class AwsError extends TaggedError("AwsError")<{
  message: string;
  service: string;
  operation: string;
  cause?: unknown;
}>() {}

export class WorkOsError extends TaggedError("WorkOsError")<{
  message: string;
  operation: string;
  cause?: unknown;
}>() {}

/**
 * Error thrown when a resource is not found.
 */
export class NotFoundError extends TaggedError("NotFoundError")<{
  message: string;
  resource: string;
  id?: string;
}>() {}

/**
 * Error thrown for unhandled exceptions that don't fit other categories.
 */
export class UnhandledException extends TaggedError("UnhandledException")<{
  message: string;
  cause: unknown;
  context?: string;
}>() {}

/**
 * Error thrown when file upload operations fail.
 */
export class FileUploadError extends TaggedError("FileUploadError")<{
  message: string;
  reason: string;
  filename?: string;
  cause?: unknown;
}>() {}

/**
 * Error thrown when API request validation fails.
 */
export class ApiValidationError extends TaggedError("ApiValidationError")<{
  message: string;
  errors: string;
}>() {}

export class QueryError extends TaggedError("QueryError")<{
  message: string;
}>() {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class QueryLoading extends TaggedError("QueryLoading")<{}>() {}
