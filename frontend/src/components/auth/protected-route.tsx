"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { CircleNotch } from "@phosphor-icons/react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-black text-white">
                <CircleNotch className="animate-spin h-8 w-8 text-sky-500" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
