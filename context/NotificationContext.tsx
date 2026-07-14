"use client"

import api from "@/lib/axios";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";

interface NotificationContextType {
    unreadCount: number;
    fetchUnreadCount: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationContextProvider = ({ children }: { children: React.ReactNode }) => {

    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("NotificationContext must be within AuthContextProvider");
    const { user, loading } = authContext;

    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await api.get("/messages/unreadCount");
            if (data.success) {
                setUnreadCount(data.unreadCount)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    useEffect(() => {
        if (!loading && user) {

            fetchUnreadCount();
        }
    }, [loading, user]);

    const value = {
        unreadCount,
        fetchUnreadCount
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
};

export default NotificationContextProvider;