"use client"

import { useContext, useEffect, useRef, useState } from "react"
import ImageKitWrapper from "./ImageKitWrapper"
import EmojiPicker from 'emoji-picker-react'
import api from "@/lib/axios"
import axios from "axios"
import toast from "react-hot-toast"
import { AuthContext } from "@/context/AuthContext"
import { format } from "timeago.js"
import { useClickOutside } from "@/hooks/clickOutside"

type Comment = {
    id: string;
    description: string;
    createdAt: string;
    user: {
        username: string;
        avatar: string;
    };
    userId: string;
}

const Comments = ({ pinId }: { pinId: string }) => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("Comments must be within AuthContextProvider");
    const { user } = authContext

    const [comments, setComments] = useState<Comment[]>([]);
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);

    const emojiRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data } = await api.get("/comments/getComments", {
                    params: {
                        pinId
                    }
                });

                if (data.success) {
                    setComments(data.comments);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                }
            }
        }

        fetchComments();
    }, [pinId]);

    console.log(comments);


    const handleCreate = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (!description.trim()) return;

        try {
            const { data } = await api.post("/comments/create", {
                description,
                pinId
            });

            if (data.success) {
                setComments((prev) => [data.comment, ...prev]);
                setDescription("");
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    useClickOutside(emojiRef, () => {
        setOpen(false);
    });

    return (
        <div className="flex-1 flex flex-col gap-4 min-h-0">
            {/* COMMENT LIST */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
                {/* COUNT */}
                <span className="">
                    {comments.length === 0 ? "No comments" : comments.length + " comments"}
                </span>
                {/* COMMENT */}
                {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2">
                        <ImageKitWrapper
                            src={comment.user.avatar || "/pinterest_clone/general/noAvatar.png"}
                            alt="User Avatar"
                            width={32}
                            height={32}
                            imgWidth={32}
                            className="w-8 h-8 rounded-full"
                        />
                        {/* COMMENT CONTENT */}
                        <div className="flex flex-col">
                            <span className="text-sm text-slate-700 font-semibold">{comment.user.username}</span>
                            <p className="text-[15px] font-medium text-slate-800">{comment.description}</p>
                            <span className="text-[10px] font-light text-slate-600">{format(comment.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {user ? (
                <form onSubmit={handleCreate} className="relative bg-[#f1f1f1] p-4 rounded-4xl items-center gap-4">
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleCreate(e);
                            }
                        }}
                        className="flex-1 border-none outline-none bg-transparent text-[16px] resize-none"
                        rows={1}
                        placeholder="Add a comment"
                    />
                    {/* EMOJI */}
                    <div className="cursor-pointer text-[20px] relative" ref={emojiRef}>
                        <div onClick={() => setOpen(prev => !prev)}>😀</div>

                        {open && (
                            <div
                                className="absolute right-0 bottom-12.5 max-[751]:bottom-3
                                    max-[751px]:scale-65 max-[751px]:translate-x-[24.5%]"
                            >
                                <EmojiPicker
                                    onEmojiClick={(emojiData) => {
                                        setDescription((prev) => prev + emojiData.emoji);
                                        setOpen(false);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </form>
            ) : (
                <p className="text-sm text-gray-600">You must be logged in to be able to post a comment</p>
            )}
        </div>
    )
}

export default Comments
