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
    // BYPASS MODE: Default to logged in
    const [user, setUser] = useState<User | null>({
        id: "bypass-user",
        email: "bypass@signalops.com",
        name: "Operator Bypass",
        role: "admin"
    });
    const [token, setToken] = useState<string | null>("mock_bypass_token");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const { data: session, status } = useSession();

    // useEffect(() => {
    //     // BYPASS MODE: Logic disabled to persist mock user
    // }, [session, status]);

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
