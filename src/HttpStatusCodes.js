// 1xx - Informational Responses — indicates that the server has received the request and is processing it.
export const CONTINUE = 100;
export const SWITCHING_PROTOCOLS = 101;
export const PROCESSING = 102; // WebDAV
export const EARLY_HINTS = 103;

// 2xx - Successful Responses — indicates that the request was successfully processed.
export const OK = 200;
export const CREATED = 201;
export const ACCEPTED = 202;
export const NON_AUTHORITATIVE_INFORMATION = 203;
export const NO_CONTENT = 204;
export const RESET_CONTENT = 205;
export const PARTIAL_CONTENT = 206;
export const MULTI_STATUS = 207; // WebDAV
export const ALREADY_REPORTED = 208; // WebDAV
export const IM_USED = 226; // HTTP Delta encoding

// 3xx - Redirection Messages — indicates that the client needs to take further action to complete
export const MULTIPLE_CHOICES = 300;
export const MOVED_PERMANENTLY = 301;
export const FOUND = 302;
export const SEE_OTHER = 303;
export const NOT_MODIFIED = 304;
export const USE_PROXY = 305;
export const SWITCH_PROXY = 306; // No longer used
export const TEMPORARY_REDIRECT = 307;
export const PERMANENT_REDIRECT = 308;

// 4xx - Client-Side Errors — indicates that the request contains incorrect syntax or cannot be
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const PAYMENT_REQUIRED = 402; // Reserved for future use
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const METHOD_NOT_ALLOWED = 405;
export const NOT_ACCEPTABLE = 406;
export const PROXY_AUTHENTICATION_REQUIRED = 407;
export const REQUEST_TIMEOUT = 408;
export const CONFLICT = 409;
export const GONE = 410;
export const LENGTH_REQUIRED = 411;
export const PRECONDITION_FAILED = 412;
export const PAYLOAD_TOO_LARGE = 413;
export const URI_TOO_LONG = 414;
export const UNSUPPORTED_MEDIA_TYPE = 415;
export const RANGE_NOT_SATISFIABLE = 416;
export const EXPECTATION_FAILED = 417;
export const IM_A_TEAPOT = 418; // April Fools' joke (RFC 2324)
export const MISDIRECTED_REQUEST = 421;
export const UNPROCESSABLE_ENTITY = 422; // WebDAV
export const LOCKED = 423; // WebDAV
export const FAILED_DEPENDENCY = 424; // WebDAV
export const TOO_EARLY = 425;
export const UPGRADE_REQUIRED = 426;
export const PRECONDITION_REQUIRED = 428;
export const TOO_MANY_REQUESTS = 429;
export const REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
export const UNAVAILABLE_FOR_LEGAL_REASONS = 451; // Due to legal demands

// 5xx - Server-Side Errors — indicates that the server failed to fulfill a valid request.
export const INTERNAL_SERVER_ERROR = 500;
export const NOT_IMPLEMENTED = 501;
export const BAD_GATEWAY = 502;
export const SERVICE_UNAVAILABLE = 503;
export const GATEWAY_TIMEOUT = 504;
export const HTTP_VERSION_NOT_SUPPORTED = 505;
export const VARIANT_ALSO_NEGOTIATES = 506;
export const INSUFFICIENT_STORAGE = 507; // WebDAV
export const LOOP_DETECTED = 508; // WebDAV
export const NOT_EXTENDED = 510;
export const NETWORK_AUTHENTICATION_REQUIRED = 511;

// Additional Codes (Some Reserved or Less Common)
export const PAGE_EXPIRED = 419; // Common in some frameworks like Laravel
export const METHOD_FAILURE = 420; // Uncommon, used by some APIs
export const NO_RESPONSE = 444; // Nginx-specific
export const CLIENT_CLOSED_REQUEST = 499; // Nginx-specific
export const UNKNOWN_ERROR = 520; // Cloudflare-specific
export const WEB_SERVER_IS_DOWN = 521; // Cloudflare-specific
export const CONNECTION_TIMED_OUT = 522; // Cloudflare-specific
export const ORIGIN_UNREACHABLE = 523; // Cloudflare-specific
export const A_TIMEOUT_OCCURRED = 524; // Cloudflare-specific
export const SSL_HANDSHAKE_FAILED = 525; // Cloudflare-specific
export const INVALID_SSL_CERTIFICATE = 526; // Cloudflare-specific
export const RAILGUN_ERROR = 527; // Cloudflare-specific
