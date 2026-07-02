"use client"

import api from "@/lib/axios";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface NotificationContextType {
    unreadCount: number;
    fetchUnreadCount: () => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const {data} = await api.get("/messages/unreadCount");
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
        fetchUnreadCount();
    }, []);

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