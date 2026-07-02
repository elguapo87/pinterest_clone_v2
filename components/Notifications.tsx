import { NotificationContext } from "@/context/NotificationContext";
import { useClickOutside } from "@/hooks/clickOutside";
import api from "@/lib/axios";
import axios from "axios";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Conversation = {
    user: {
        id: string;
        username: string;
        displayName: string;
        avatar: string;
    };
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
};

const Notifications = () => {
    const notificationContext = useContext(NotificationContext);
    if (!notificationContext) throw new Error("Notifications must be within NotificationContextProvider");
    const { unreadCount } = notificationContext;

    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    const router = useRouter();
    const notificationRef = useRef<HTMLDivElement | null>(null);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get("/messages/getConversations");
            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const handleToggle = async () => {
        const nextState = !isOpen;

        if (nextState) {
            await fetchConversations();
        }

        setIsOpen(nextState);
    };

    const unreadConversations = conversations.filter((conv) => conv.unreadCount > 0);

    const chatOpen = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/messages/${id}`);
        setIsOpen(false);
    };

    useClickOutside(notificationRef, () => {
        setIsOpen(false);
    });

    return (
        <div
            onClick={handleToggle}
            ref={notificationRef}
            className="relative size-12 flex items-center justify-center hover:bg-[#f1f1f1] cursor-pointer"
        >
            <Image src="/updates.svg" alt="Updates" width={18} height={18} />

            {unreadCount > 0 && (
                <div
                    className="absolute top-1.5 right-2  size-3.5 rounded-full flex items-center justify-center
                        bg-red-500 text-stone-50 text-xs"
                >
                    {unreadCount}
                </div>
            )}

            {isOpen && (
                <div
                    className="absolute top-0 left-13 p-3 bg-white border border-[#e9e9e9]
                        rounded-2xl shadow-lg flex flex-col items-start justify-center w-max"
                >
                    {unreadConversations.length === 0 ? (
                        <p className="text-gray-600">All up to date</p>   
                    ) : (
                        unreadConversations.map((conv) => (
                            <div
                                key={conv.user.id}
                                onClick={(e) => chatOpen(conv.user.id, e)}
                                className="inline-flex items-center gap-2 hover:bg-slate-200 hover:rounded-xl p-2"
                            >
                                <span
                                    className="text-red-600 font-semibold text-sm"
                                >
                                    {conv.unreadCount}
                                </span>

                                <p>new message{conv.unreadCount > 1 ? "s" : ""} from {conv.user.username}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default Notifications
