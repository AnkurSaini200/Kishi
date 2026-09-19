export const API_BASE_URL = 'http://localhost:8080';

export interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    token,
    headers = {},
    ...customOptions
  } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  /*
   * Add JWT to the Authorization header
   * when a token was provided.
   */
  if (token) {
    defaultHeaders['Authorization'] =
      `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  let response: Response;

  try {
    response = await fetch(url, {
      ...customOptions,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    });
  } catch {
    /*
     * fetch() itself failed.
     *
     * This usually means:
     * - backend is down
     * - network connection failed
     * - CORS/network problem
     */
    throw new Error(
      'Unable to connect to Kishi server. Please check that the backend is running.'
    );
  }

  /*
   * ---------------------------------------------------------
   * JWT EXPIRED / INVALID
   * ---------------------------------------------------------
   *
   * Spring Security returns 401 when the JWT is invalid
   * or expired.
   *
   * Notify AuthContext so it can log the user out.
   */
  if (response.status === 401) {
    window.dispatchEvent(
      new CustomEvent('kishi:unauthorized')
    );

    throw new Error(
      'Your session has expired. Please log in again.'
    );
  }

  /*
   * ---------------------------------------------------------
   * OTHER HTTP ERRORS
   * ---------------------------------------------------------
   */
  if (!response.ok) {
    let errorMessage =
      `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();

      if (
        errorData &&
        typeof errorData === 'object'
      ) {
        errorMessage =
          errorData.message ||
          errorData.error ||
          errorMessage;
      }
    } catch {
      /*
       * The response was not JSON.
       * Try reading it as plain text.
       */
      try {
        const text =
          await response.text();

        if (text) {
          errorMessage = text;
        }
      } catch {
        /*
         * Ignore parsing failure.
         * Keep the default error message.
         */
      }
    }

    throw new Error(errorMessage);
  }

  /*
   * ---------------------------------------------------------
   * SUCCESS RESPONSE
   * ---------------------------------------------------------
   *
   * Some endpoints return JSON.
   * Others may return plain text.
   */
  const contentType =
    response.headers.get('content-type');

  if (
    contentType &&
    contentType.includes('application/json')
  ) {
    return response.json();
  }

  const text =
    await response.text();

  return text as unknown as T;
}