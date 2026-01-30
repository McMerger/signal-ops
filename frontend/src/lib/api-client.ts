import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = 'https://execution-core.cortesmailles01.workers.dev';
console.log('[API Client] V4 - FORCED PROD URL:', API_BASE_URL);

class APIClient {
    private client: AxiosInstance;
    private retryCount: number = 3;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Add auth token if available
                const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Log request for debugging
                console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                console.log(`[API] ✓ ${response.config.url}`, response.data);
                return response;
            },
            async (error: AxiosError) => {
                const config = error.config as AxiosRequestConfig & { _retry?: number };

                // Implement retry logic
                if (error.response?.status === 503 && (!config._retry || config._retry < this.retryCount)) {
                    config._retry = (config._retry || 0) + 1;
                    console.log(`[API] Retry ${config._retry}/${this.retryCount} for ${config.url}`);

                    // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, 1000 * config._retry!));

                    return this.client(config);
                }

                console.error(`[API] ✗ ${config?.url}`, error.response?.data || error.message);
                return Promise.reject(error);
            }
        );
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }
}

export const apiClient = new APIClient();

// Helper for typed API calls
export async function apiCall<T>(config: AxiosRequestConfig): Promise<T> {
    try {
        const response = await apiClient.get<T>(config.url!, config);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error((error.response?.data as any)?.error || error.message);
        }
        throw error;
    }
}
