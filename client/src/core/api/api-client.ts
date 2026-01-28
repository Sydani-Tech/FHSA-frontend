import { toast } from "@/hooks/use-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

type RequestConfig = RequestInit & {
  // Add any custom config here if needed
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || errorData.detail || response.statusText;
    
    // Optional: Global error handling (e.g., toast) based on status code
      if (response.status === 401) {
       // Dispatch global event for AuthProvider to handle logout
       window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }

    throw new Error(errorMessage);
  }
  
  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Public API client for endpoints that don't require authentication
 */
export const publicApi = {
  get: async <T>(url: string, config?: RequestConfig): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
    });
    return handleResponse<T>(response);
  },

  post: async <T>(url: string, body: any, config?: RequestConfig): Promise<T> => {
    const isFormData = body instanceof FormData;
    const headers: any = {
      ...config?.headers,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },
};

/**
 * Authenticated API client that adds Bearer token
 */
const getAuthHeaders = (headers?: HeadersInit, isFormData: boolean = false) => {
  const token = localStorage.getItem("token");
  const authHeaders: any = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
  
  if (!isFormData) {
    authHeaders["Content-Type"] = "application/json";
  }
  
  return authHeaders;
};

export const authApi = {
  get: async <T>(url: string, config?: RequestConfig): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: "GET",
      // credentials: "include", // No longer needed for JWT unless using cookies
      headers: getAuthHeaders(config?.headers),
    });
    return handleResponse<T>(response);
  },

  post: async <T>(url: string, body: any, config?: RequestConfig): Promise<T> => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: "POST",
      // credentials: "include",
      headers: getAuthHeaders(config?.headers, isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  put: async <T>(url: string, body: any, config?: RequestConfig): Promise<T> => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: "PUT",
      // credentials: "include",
      headers: getAuthHeaders(config?.headers, isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  patch: async <T>(url: string, body: any, config?: RequestConfig): Promise<T> => {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: "PATCH",
      // credentials: "include",
      headers: getAuthHeaders(config?.headers, isFormData),
      body: isFormData ? body : JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  delete: async <T>(url: string, config?: RequestConfig): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: "DELETE",
      // credentials: "include",
      headers: getAuthHeaders(config?.headers),
    });
    return handleResponse<T>(response);
  },
};
