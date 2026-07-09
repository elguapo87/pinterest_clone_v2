"use client"

import Image from "next/image"
import AuthGuard from "./auth/AuthGuard"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "./Loader";

type Board = {
    id: string;
    title: string;
};

type Pin = {
    board: {
        id: string;
        title: string;
    };
    boardId: string;
    createdAt: string | Date;
    description: string;
    height: number;
    id: string;
    link: string;
    media: string;
    tags: [];
    title: string;
    updatedAt: string | Date;
    width: number;
    isSensitive: boolean;
};


const EditPinWrapper = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("CreatePageWrapper must be within AuthContextProvider");
    const { user } = authContext;

    const { id } = useParams() as { id: string };

    const [media, setMedia] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoard, setSelectedBoard] = useState("");
    const [tags, setTags] = useState("");
    const [pin, setPin] = useState<Pin | null>(null);
    const [isSensitive, setIsSensitive] = useState(false);

    const [previewImage, setPreviewImage] = useState<{
        url: string;
        width: number;
        height: number
    } | null>(null);

    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        const fetchPin = async () => {
            try {
                const { data } = await api.get(`/pins/${id}`);
                if (data.success) {
                    setPin(data.pin);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                }
            }
        };

        fetchPin();
    }, [id]);

    useEffect(() => {
        if (!user) return;

        const fetchBoards = async () => {
            try {
                const { data } = await api.get("/boards/userBoards");
                if (data.success) {
                    setBoards(data.boards);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                }
            }
        };

        fetchBoards();
    }, [user]);

    useEffect(() => {
        if (!pin) return;

        setTitle(pin.title);
        setDescription(pin.description);
        setLink(pin.link);
        setTags(pin.tags.join(", "));
        setSelectedBoard(pin.boardId || "");
        setPreviewImage({
            url: pin.media,
            width: pin.width,
            height: pin.height
        });
        setIsSensitive(pin.isSensitive);

    }, [pin]);

    const handleUpdate = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            setLoading(true)
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("link", link);
            formData.append("board", selectedBoard);
            formData.append("tags", tags);
            formData.append("isSensitive", String(isSensitive));

            if (media) {
                formData.append("media", media);
            }

            const { data } = await api.put(`/pins/update?id=${id}`, formData);
            if (data.success) {
                toast.success(data.message);
                router.push("/");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!media) return;

        const imageUrl = URL.createObjectURL(media);

        const img = new window.Image();

        img.src = imageUrl;

        img.onload = () => {
            setPreviewImage({
                url: imageUrl,
                width: img.width,
                height: img.height
            });
        };

        return () => URL.revokeObjectURL(imageUrl);
    }, [media]);

    return pin ? (
        <AuthGuard>
            <form onSubmit={handleUpdate}>
                {/* CREATE TOP */}
                <div className="border-y border-[#e9e9e9] py-4 px-0 flex items-center justify-between">
                    <h1 className="text-[20px] font-medium">Edit Pin</h1>

                    <div className="flex items-center gap-4 cursor-pointer">
                        <Image
                            onClick={() => router.back()}
                            src="/arrow_back.svg"
                            alt="Arrow Back"
                            width={40}
                            height={40}
                            className="size-8 md:size-10 hover:scale-105 transition-all duration-200"
                        />

                        <button
                            type="submit"
                            className="bg-[#e50829] text-white font-medium border-none outline-none py-3 px-4
                            rounded-4xl cursor-pointer text-[15px] hover:bg-[#c1011e]"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>

                </div>

                < div
                    className="mt-8 flex justify-center gap-16 max-[1104px]:flex-col
                        max-[1104px]:items-center max-[1104px]:mb-16"
                >
                    <div className="flex flex-col items-center gap-5">
                        {/* UPLOAD */}
                        <div
                            className="bg-[#e9e9e9] cursor-pointer flex items-center justify-center
                            rounded-4xl border-dashed border-[#dddddd] w-93.75 h-143.5 p-4
                            relative max-[475px]:w-full"

                        >
                            {previewImage && (
                                <div className="group relative w-93.75 h-143.5 max-[475px]:w-full">
                                    <Image
                                        src={previewImage.url}
                                        alt="Preview Image"
                                        fill
                                        className="object-cover rounded-4xl"
                                    />

                                    <div
                                        className="absolute top-0 left-0 rounded-4xl inset-0 bg-black/40 opacity-0 
                                        group-hover:opacity-100 transition-opacity duration-200"
                                    >
                                        <label
                                            htmlFor="imgChange"
                                            className="absolute inset-0 flex items-center justify-center opacity-0
                                            group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                                        >
                                            <Image
                                                src="/upload.svg"
                                                alt="Replace Image"
                                                width={200}
                                                height={200}
                                                className="z-10 size-50"
                                            />
                                            <input
                                                onChange={(e) => setMedia(e.target.files && e.target.files[0])}
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                id="imgChange"
                                            />
                                        </label>
                                    </div>

                                    {media && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMedia(null);
                                                if (pin) {
                                                    setPreviewImage({
                                                        url: pin.media,
                                                        width: pin.width,
                                                        height: pin.height
                                                    });
                                                }
                                            }}
                                            className="absolute top-4 left-4 font-semibold text-gray-800 
                                            hover:scale-101 cursor-pointer text-xl size-10 bg-stone-100
                                            rounded-full flex items-center justify-center border border-gray-200"
                                        >
                                            X
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* SENSITIVE FLAG */}
                        <div className="flex items-center gap-3">
                            <input
                                id="sensitive"
                                type="checkbox"
                                checked={isSensitive}
                                onChange={(e) => setIsSensitive(e.target.checked)}
                            />

                            <label htmlFor="sensitive">
                                This Pin contains sensitive content
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 w-146 max-[768px]:w-full">
                        {/* CREATE FORM iTEM */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="title" className="text-[13px] text-gray-600 ">Title</label>
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl"
                                type="text"
                                placeholder="Add a title"
                                id="title"
                            />
                        </div>
                        {/* CREATE FORM iTEM */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="description" className="text-[13px] text-gray-600 ">
                                Description
                            </label>
                            <textarea
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl resize-none"
                                rows={6}
                                placeholder="Add a detailed description"
                                id="description"
                            />
                        </div>
                        {/* CREATE FORM iTEM */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="link" className="text-[13px] text-gray-600 ">Link</label>
                            <input
                                onChange={(e) => setLink(e.target.value)}
                                value={link}
                                className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl"
                                type="text"
                                placeholder="Add a link"
                                id="link"
                            />
                        </div>
                        {/* CREATE FORM iTEM */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="board" className="text-[13px] text-gray-600 ">Board</label>
                            <select
                                onChange={(e) => setSelectedBoard(e.target.value)}
                                value={selectedBoard}
                                id="board"
                                className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl"
                            >
                                <option value="">No board (optional)</option>
                                {boards.map((board) => (
                                    <option key={board.id} value={board.id}>{board.title}</option>
                                ))}
                            </select>
                        </div>
                        {/* CREATE FORM iTEM */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="tags" className="text-[13px] text-gray-600 ">Tagged topics</label>
                            <input
                                onChange={(e) => setTags(e.target.value)}
                                value={tags}
                                className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl"
                                type="text"
                                placeholder="Add tags"
                                id="tags"
                            />
                            <small className="text-[#a6a6a6] text-[13px]">
                                Don&apos;t worry, people people won&apos;t see your tags
                            </small>
                        </div>
                    </div>
                </div>

            </form>
        </AuthGuard >
    ) : (
        <Loader />
    )
}

export default EditPinWrapper