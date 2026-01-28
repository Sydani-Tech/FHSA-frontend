import { publicApi } from "@/core/api/api-client";

export const uploadService = {
  uploadFile: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    // publicApi usually sends JSON, so we need to override headers or use a specific configured instance
    // Assuming publicApi can handle FormData if we let the browser set the Content-Type (by not setting it manually)
    // However, the current api-client instance might be pre-configured with Content-Type: application/json
    // Let's rely on standard fetch or axios behavior. If publicApi sets Content-Type automatically, we might need a separate call or specific override.
    
    // For simplicity, let's try using the instance. If it fails due to headers, we'll fix.
    // Actually, axois sets content-type to multipart/form-data automatically if data is FormData.
    // publicApi now handles FormData vs JSON automatically
    const response = await publicApi.post<{ url: string }>("/upload/", formData);
    return response.url;
  },
};
