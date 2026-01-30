"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService, User } from "@/services/auth-service";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const { data: session, status } = useSession();

    useEffect(() => {
        const initAuth = async () => {
            // Priority 1: Check NextAuth Session (GitHub Login)
            if (status === "authenticated" && session?.backendToken) {
                // @ts-ignore
                const backendToken = session.backendToken as string;
                // @ts-ignore
                const backendUser = session.user as User;

                if (backendToken && backendUser) {
                    setToken(backendToken);
                    setUser(backendUser);
                    // Sync to local storage for compatibility
                    localStorage.setItem('token', backendToken);
                    localStorage.setItem('user', JSON.stringify(backendUser));
                    setIsLoading(false);
                    return;
                }
            }

            // Priority 2: Check Local Storage (Legacy Login)
            const storedToken = authService.getToken();
            if (storedToken) {
                // Verify token with backend
                try {
                    const verifiedUser = await authService.getCurrentUser();
                    if (verifiedUser) {
                        setUser(verifiedUser);
                        setToken(storedToken);
                    } else {
                        // Token invalid
                        setUser(null);
                        setToken(null);
                    }
                } catch (error) {
                    console.error("Auth verification failed:", error);
                    setUser(null);
                    setToken(null);
                }
            }
            setIsLoading(false);
        };

        if (status !== "loading") {
            initAuth();
        }
    }, [session, status]);

    const login = async (email: string, password: string) => {
        try {
            const data = await authService.login(email, password);
            setUser(data.user);
            setToken(data.token);
            router.push("/dashboard");
        } catch (error: any) {
            throw new Error(error.response?.data?.error || error.message || "Failed to login");
        }
    };

    const signup = async (email: string, password: string, name: string) => {
        try {
            const data = await authService.signup(email, password, name);
            setUser(data.user);
            setToken(data.token);
            router.push("/dashboard");
        } catch (error: any) {
            throw new Error(error.response?.data?.error || error.message || "Failed to create account");
        }
    };

    const logout = () => {
        authService.logout();
        nextAuthSignOut({ redirect: false });
        setUser(null);
        setToken(null);
        router.push("/login");
    };

    const getToken = () => {
        return authService.getToken();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, token, login, signup, logout, getToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
