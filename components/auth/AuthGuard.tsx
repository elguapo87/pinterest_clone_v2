"use client"

import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import Loader from "../Loader";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("AuthGuard must be within AuthContextProvider");
    const { user, loading } = authContext;

    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/auth");
        }
    }, [user, loading, router]);

    if (loading && !user) return <Loader />

    return <>{children}</>
}
