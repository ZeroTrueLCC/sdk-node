// Main client
import { ZeroTrue } from './client';
export default ZeroTrue;
export { ZeroTrue };

// Types
export type {
  ZeroTrueOptions,
  CheckCreateParams,
  CheckCreateFromFileParams,
  CheckResponse,
  CheckResult,
  CheckStatus,
  TextInput,
  URLInput,
  InputType,
  SuspectedModel,
  ContentSegment,
  WaitOptions,
  ErrorResponse,
  ErrorCode,
} from './types';

// Errors
export {
  ZeroTrueError,
  APIError,
  ValidationError,
  AuthenticationError,
  RateLimitError,
} from './errors';
