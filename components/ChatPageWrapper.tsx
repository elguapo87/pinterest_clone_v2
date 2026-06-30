"use client"

import { use, useContext, useEffect, useRef, useState } from 'react'
import AuthGuard from './auth/AuthGuard'
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from './Loader';
import Image from 'next/image';
import { AuthContext } from '@/context/AuthContext';
import { format } from 'timeago.js';

type Message = {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
};

type Receiver = {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
};

const ChatPageWrapper = () => {

    const { receiverId } = useParams() as { receiverId: string };

    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("ChatPageWrapper should be within AuthContextProvider");
    const { user } = authContext;

    const [receiver, setReceiver] = useState<Receiver | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const msgEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!receiverId) return;

        const fetchMessages = async () => {
            setLoading(true);

            try {
                const { data } = await api.get(`/messages/getMessages?receiverId=${receiverId}`);

                if (data.success) {
                    setReceiver(data.receiver);
                    setMessages(data.messages);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [receiverId]);

    useEffect(() => {
        msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        try {
            if (!content.trim()) return;

            const { data } = await api.post("/messages/send", {
                content,
                receiverId
            });

            if (data.success) {
                setMessages((prev) => [...prev, data.message]);
                setContent("");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    if (loading) return <Loader />;
    if (!receiver) return null;

    return (
        <AuthGuard>
            <div className="flex flex-col h-screen">
                <div
                    className="fixed top-0 w-full -translate-x-4 flex items-center gap-2 p-2 md:px-10 xl:pl-42
                        bg-linear-to-r from-green-50 to-red-50 border-b border-gray-300"
                >
                    <Image
                        src={receiver.avatar || "/noAvatar.png"}
                        alt=""
                        width={32}
                        height={32}
                        className="size-8 rounded-full aspect-square object-cover"

                    />
                    <div>
                        <p className="font-medium">{receiver.username}</p>
                        <p className="text-sm text-gray-500 -mt-1.5">@{receiver.displayName}</p>
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto pt-20 pb-24 px-5 md:px-10">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {messages.map((msg) => {
                            const isMine = msg.senderId === user?.id;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`p-2 text-sm max-w-xs bg-white text-slate-700 rounded-lg shadow
                                        ${isMine ? "rounded-br-none" : "rounded-bl-none"}`}
                                    >
                                        {msg.content}
                                    </div>

                                    <p className="text-[10px] text-gray-600 font-light ">{format(msg.createdAt)}</p>
                                </div>
                            );
                        })}

                        <div ref={msgEndRef} />
                    </div>
                </div>

                {/* SEND INPUT */}
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50">
                    <div
                        className="flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl
                            mx-auto border border-gray-200 shadow rounded-full mb-5"
                    >
                        <input
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            placeholder="Type a message..."
                            className="flex-1 outline-none text-slate-700"
                        />

                        <button
                            onClick={sendMessage}
                            className="bg-stone-50 hover:bg-white active:scale-95 cursor-pointer
                                text-white p-2 rounded-full border border-gray-300"
                        >
                            <Image
                                src="/send_icon.svg"
                                alt="Send Icon"
                                width={18}
                                height={18}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}

export default ChatPageWrapper
