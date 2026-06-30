"use client"

import api from "@/lib/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AuthGuard from "./auth/AuthGuard";
import Image from "next/image";

type Conversation = {
    user: {
        id: string;
        username: string;
        displayName: string;
        avatar: string;
    };
    lastMessage: string;
    lastMessageAt: string;
};


const MessagesWrapper = () => {

    const [conversations, setConversations] = useState<Conversation[]>([]);

    const router = useRouter();

    useEffect(() => {
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

        fetchConversations();
    }, []);

    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-50">
                <div className="max-w-6xl mx-auto p-6">
                    {/* TITLE */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
                    </div>

                    {/* CONVERSATIONS */}
                    <div className="flex flex-col gap-3">
                        {!conversations.length ? (
                            <p className="text-slate-500 text-lg">No conversations yet</p>
                        ) : (
                            <>
                                {conversations.map((conv) => (
                                    <div
                                        key={conv.user.id}
                                        className="max-w-xl flex items-center gap-1 md:gap-5 p-4 md:p-6 bg-white
                                            shadow rounded-md"
                                    >
                                        <Image
                                            src={conv.user.avatar || "/noAvatar.png"}
                                            width={48}
                                            height={48}
                                            alt=""
                                            className="rounded-full aspect-square size-10 md:size-12 object-cover"
                                        />

                                        <div className="flex-1">
                                            <p className="font-medium text-sm  md:text-base text-slate-700">
                                                {conv.user.username}
                                            </p>
                                            <p className="text-slate-500 text-[12px] md:text-sm">
                                                @{conv.user.displayName}
                                            </p>
                                        </div>

                                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                                            <button
                                                onClick={() => router.push(`/messages/${conv.user.id}`)}
                                                className="size-10 flex items-center justify-center text-sm rounded
                                                    bg-slate-100 hover:bg-slate-200 text-slate-800
                                                    active:scale-95 transition cursor-pointer"

                                            >
                                                <Image
                                                    src="/eye.svg"
                                                    alt="Message"
                                                    width={20}
                                                    height={20}
                                                    className="size-5"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}

export default MessagesWrapper
