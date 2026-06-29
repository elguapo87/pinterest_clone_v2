"use client"

import api from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";


type User = {
    id: string;
    displayName: string;
    username: string;
    email: string;
    avatar: string;
};

type RegisterData = {
    displayName: string;
    username: string;
    email: string;
    password: string;
};

type LoginData = {
    email: string;
    password: string;
};

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    loading: boolean;
    authLoading: boolean;
    register: (credentials: RegisterData) => Promise<void>;
    login: (credentials: LoginData) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const { data } = await api.get("/auth/me");

                setUser(data.user);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const register = async (credentials: RegisterData) => {
        try {
            setAuthLoading(true);
            const { data } = await api.post("/auth/register", credentials);

            if (data.success) {
                setUser(data.user);
                toast.success(data.message);
                router.replace("/");

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const login = async (credentials: LoginData) => {
        try {
            setAuthLoading(true);
            const { data } = await api.post("/auth/login", credentials);

            if (data.success) {
                setUser(data.user);
                toast.success(data.message);
                router.replace("/");

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        try {
            setAuthLoading(true);
            const { data } = await api.post("/auth/logout");
            if (data.success) {
                setUser(null);
                toast.success(data.message);
                router.replace("/");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const value = {
        user, setUser,
        register,
        login,
        loading,
        authLoading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContextProvider;