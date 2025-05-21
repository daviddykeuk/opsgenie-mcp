import axios from "axios";

/**
 * Type for axios request config
 */
interface RequestConfig {
  headers: Record<string, string>;
  params?: Record<string, string | number>;
}

/**
 * Makes a GET request to the OpsGenie API
 * @param endpoint The API endpoint to call
 * @param params Optional query parameters
 * @returns The API response data
 * @throws Error if the API call fails or API key is not set
 */
export async function opsgenieGet<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const apiKey = process.env.OPSGENIE_API_KEY;
  if (!apiKey) {
    throw new Error("Opsgenie API key is not set in the environment variable OPSGENIE_API_KEY.");
  }

  const config: RequestConfig = {
    headers: {
      Authorization: `GenieKey ${apiKey}`,
    },
    params,
  };

  const response = await axios.get<T>(`https://api.opsgenie.com/v2${endpoint}`, config);
  return response.data;
}

/**
 * Makes a POST request to the OpsGenie API
 * @param endpoint The API endpoint to call
 * @param data The request body
 * @param params Optional query parameters
 * @returns The API response data
 * @throws Error if the API call fails or API key is not set
 */
export async function opsgeniePost<T>(
  endpoint: string,
  data: any,
  params?: Record<string, string | number>
): Promise<T> {
  const apiKey = process.env.OPSGENIE_API_KEY;
  if (!apiKey) {
    throw new Error("Opsgenie API key is not set in the environment variable OPSGENIE_API_KEY.");
  }

  const config: RequestConfig = {
    headers: {
      Authorization: `GenieKey ${apiKey}`,
      "Content-Type": "application/json",
    },
    params,
  };

  const response = await axios.post<T>(`https://api.opsgenie.com/v2${endpoint}`, data, config);
  return response.data;
}

/**
 * Creates a standard error response for MCP tools
 * @param error The error object
 * @returns An error response object for MCP tools
 */
export function createErrorResponse(error: any) {
  return {
    structuredContent: {},
    isError: true,
    content: [
      {
        type: "text",
        text: `Error: ${error.response?.data?.message || error.message}`,
      },
    ],
  } as const;
}

/**
 * Creates a standard success response for MCP tools
 * @param data The data to return in the response
 * @returns A success response object for MCP tools
 */
export function createSuccessResponse(data: any) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data),
      },
    ],
  } as const;
} 