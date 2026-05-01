/**
 * Type of input for check
 * @public
 */
export type InputType = 'text' | 'url';

/**
 * Status of check processing
 * @public
 */
export type CheckStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'completed_with_fallback'
  | 'failed'
  | 'canceled'
  | 'expired';

/**
 * Text input for checking
 * @public
 */
export interface TextInput {
  type: 'text';
  value: string;
}

/**
 * URL input for checking
 * @public
 */
export interface URLInput {
  type: 'url';
  value: string;
}

/**
 * Parameters for creating a check
 * @public
 */
export interface CheckCreateParams {
  /**
   * Input data to check (text or URL)
   */
  input: TextInput | URLInput;

  /**
   * Whether to perform private scan (results not publicly visible)
   * @default true
   */
  isPrivateScan?: boolean;

  /**
   * Whether to perform deep scan (more thorough analysis)
   * @default false
   */
  isDeepScan?: boolean;

  /**
   * Idempotency key to prevent duplicate requests (max 50 chars)
   * If provided, duplicate requests with same key will return cached response
   */
  idempotencyKey?: string;

  /**
   * Additional metadata for the check
   */
  metadata?: Record<string, unknown>;
}

/**
 * Parameters for creating check from file
 * @public
 */
export interface CheckCreateFromFileParams {
  /**
   * Whether to perform private scan
   * @default true
   */
  isPrivateScan?: boolean;

  /**
   * Whether to perform deep scan
   * @default false
   */
  isDeepScan?: boolean;

  /**
   * Idempotency key
   */
  idempotencyKey?: string;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Basic check response (when queued)
 * @public
 */
export interface CheckResponse {
  /**
   * Unique identifier for the check
   */
  id: string;

  /**
   * Current status of the check
   */
  status: CheckStatus;
}

/**
 * Model suspected of generating the content
 * @public
 */
export interface SuspectedModel {
  /**
   * Name of the suspected model (e.g., 'claude', 'chatgpt', 'midjourney')
   */
  model_name: string;

  /**
   * Confidence percentage (0-100)
   */
  confidence_pct: number;
}

/**
 * Segment of content with AI/human classification
 * @public
 */
export interface ContentSegment {
  /**
   * Label for the segment (e.g., 'aigen', 'human', 'deepfake', 'authentic')
   */
  label?: string;

  /**
   * Confidence percentage (0-100)
   */
  confidence_pct?: number;

  /**
   * Start character position (for text/code)
   */
  start_char?: number;

  /**
   * End character position (for text/code)
   */
  end_char?: number;

  /**
   * Start line number (for code)
   */
  start_line?: number;

  /**
   * End line number (for code)
   */
  end_line?: number;

  /**
   * Start time in seconds (for video/audio)
   */
  start_s?: number;

  /**
   * End time in seconds (for video/audio)
   */
  end_s?: number;

  /**
   * Timecode string (e.g., '00:00:10')
   */
  timecode?: string;
}

/**
 * Complete check result with analysis data
 * @public
 */
export interface CheckResult extends CheckResponse {
  /**
   * When the check was created (ISO 8601 format, from AnalysisResult)
   */
  created_at?: string;

  /**
   * AI probability (0-1)
   */
  ai_probability?: number;

  /**
   * Human probability (0-1)
   */
  human_probability?: number;

  /**
   * Combined probability score (0-1)
   */
  combined_probability?: number;

  /**
   * Type of result (e.g., 'ai_generated', 'human_created')
   */
  result_type?: string;

  /**
   * ML model used for analysis
   */
  ml_model?: string;

  /**
   * Version of the ML model
   */
  ml_model_version?: string;

  /**
   * Detailed analysis results
   */
  details?: Record<string, unknown>;

  /**
   * User feedback on the result
   */
  feedback?: string | null;

  /**
   * URL to the analyzed file
   */
  file_url?: string;

  /**
   * Original filename
   */
  original_filename?: string;

  /**
   * File size in bytes
   */
  size_bytes?: number;

  /**
   * File size in megabytes
   */
  size_mb?: number;

  /**
   * Resolution (e.g., '1920x1080' for images/videos)
   */
  resolution?: string;

  /**
   * Length in seconds (for audio/video)
   */
  length?: number;

  /**
   * Whether this was a private scan
   */
  is_private_scan?: boolean;

  /**
   * Whether this was a deep scan
   */
  is_deep_scan?: boolean;

  /**
   * Price in credits
   */
  price?: number;

  /**
   * URL to preview/thumbnail
   */
  preview_url?: string | null;

  /**
   * Inference time in milliseconds
   */
  inference_time_ms?: number;

  /**
   * API schema version
   */
  api_schema_version?: string;

  /**
   * MIME type
   */
  meta_mime?: string;

  /**
   * File size in bytes (metadata)
   */
  meta_file_size_bytes?: number;

  /**
   * SHA256 hash
   */
  meta_sha256?: string;

  /**
   * Content URL (metadata)
   */
  meta_content_url?: string;

  /**
   * Content type (metadata)
   */
  meta_content_type?: string;

  /**
   * Summary of detailed analysis
   */
  details_summary?: Record<string, unknown>;

  /**
   * Extra details
   */
  details_extra?: Record<string, unknown>;

  /**
   * List of suspected AI models
   */
  suspected_models?: SuspectedModel[];

  /**
   * Content segments with classifications
   */
  segments?: ContentSegment[];
}

/**
 * Options for polling/waiting for check completion
 * @public
 */
export interface WaitOptions {
  /**
   * Polling interval in milliseconds
   * @default 2000
   */
  pollInterval?: number;

  /**
   * Maximum time to wait in milliseconds
   * @default 300000 (5 minutes)
   */
  maxPollTime?: number;

  /**
   * AbortSignal for cancellation
   */
  signal?: AbortSignal;
}
