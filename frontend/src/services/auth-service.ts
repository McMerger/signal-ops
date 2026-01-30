import axios from 'axios';

const getApiUrl = () => {
    // 1. Explicit Localhost Detection (Client-Side Only)
    // ONLY use localhost if we are explicitly on a local dev environment.
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:8080';
    }

    // 2. Default to Production (Always)
    // We ignore process.env.NEXT_PUBLIC_API_URL to prevent accidental localhost references in production.
    return 'https://execution-core.cortesmailles01.workers.dev';
};
const API_URL = getApiUrl();
console.log('[API] Final API_URL:', API_URL);

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

interface AuthResponse {
    token: string;
    user: User;
}

class AuthService {
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, {
            email,
            password
        });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    }

    async signup(email: string, password: string, name: string): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/signup`, {
            email,
            password,
            name
        });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    async getCurrentUser(): Promise<User | null> {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await axios.get<User>(`${API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            // Token invalid or expired
            this.logout();
            return null;
        }
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}

export const authService = new AuthService();
