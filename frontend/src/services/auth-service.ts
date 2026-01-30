import axios from 'axios';

// SCORCHED EARTH POLICY: Hardcoded Production URL
const API_URL = 'https://execution-core.cortesmailles01.workers.dev';
console.log('[API] V4 - FORCED PROD URL:', API_URL);

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
