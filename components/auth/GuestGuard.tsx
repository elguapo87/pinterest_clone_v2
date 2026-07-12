import { AuthContext } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";
import Loader from "../Loader";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("GuestGuard must be within AuthContextProvider");
    const { user, loading } = authContext;

    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect");

    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace(redirect || "/");
        }
    }, [user, loading, router]);

    if (loading && user) return <Loader />

    return <>{children}</>
}