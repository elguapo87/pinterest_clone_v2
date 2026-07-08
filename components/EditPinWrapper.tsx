"use client"

import Image from "next/image"
import AuthGuard from "./auth/AuthGuard"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import PinEditor from "./pinEditor/PinEditor";
import { EditorContext, initialCanvasOptions, initialTextOptions } from "@/context/EditorContext";
import Loader from "./Loader";
import { url } from "inspector";

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

    canvasOptions: {
        size: string;
        width: number;
        height: number;
        orientation: "portrait" | "landscape";
        backgroundColor: string;
    };
    createdAt: string | Date;
    description: string;
    height: number;
    id: string;
    link: string;
    media: string;
    tags: [];
    textOptions: {
        color: string;
        fontSize: number;
        isVisible: boolean;
        left: number;
        text: string;
        top: number;
    };
    title: string;
    updatedAt: string | Date;
    width: number;
};
const EditPinWrapper = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("CreatePageWrapper must be within AuthContextProvider");
    const { user } = authContext;

    const { id } = useParams() as { id: string };

    const editorContext = useContext(EditorContext);
    if (!editorContext) throw new Error("CreatePageWrapper must be within EditorContextProvider");
    const { textOptions, canvasOptions, setTextOptions, setCanvasOptions } = editorContext;

    const [pin, setPin] = useState<Pin | null>(null);
    const [media, setMedia] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoard, setSelectedBoard] = useState("");
    const [tags, setTags] = useState("");

    const [previewImage, setPreviewImage] = useState<{
        url: string;
        width: number;
        height: number
    } | null>(null);

    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [hasEdited, setHasEdited] = useState(false);

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

    console.log(pin);

    useEffect(() => {
        if (!pin) return;

        setTitle(pin.title);
        setDescription(pin.description);
        setLink(pin.link);
        setSelectedBoard(pin.boardId || "");
        setTags(pin.tags.join(", "));

        setTextOptions(pin.textOptions || initialTextOptions);
        setCanvasOptions(pin.canvasOptions || initialCanvasOptions);

        setPreviewImage({
            url: pin.media,
            width: pin.width,
            height: pin.height,
        });

    }, [pin]);


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

    const handleUpdate = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (isEditing) {
            setIsEditing(false);

        } else {
            try {
                setLoading(true)

                const formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("link", link);
                formData.append("board", selectedBoard);
                formData.append("tags", tags);

                // if (hasEdited) {
                //     formData.append("textOptions", JSON.stringify(textOptions));
                //     formData.append("canvasOptions", JSON.stringify(canvasOptions));
                // }

                if (media) {
                    formData.append("media", media);
                }

                const { data } = await api.put(`/pins/update?id=${id}`, formData);
                if (data.success) {
                    // setTextOptions(initialTextOptions);
                    // setCanvasOptions(initialCanvasOptions);

                    // setMedia(null);
                    // setPreviewImage(null);
                    // setHasEdited(false);
                    // setIsEditing(false);

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

        return () => {
            URL.revokeObjectURL(imageUrl);
        }

    }, [media]);

    return pin ? (
        <AuthGuard>
            <form onSubmit={handleUpdate}>
                {/* CREATE TOP */}
                <div className="border-y border-[#e9e9e9] py-4 px-0 flex items-center justify-between">
                    <h1 className="text-[20px] font-medium">{isEditing ? "Edit Design" : "Edit Pin"}</h1>
                    <button
                        type="submit"
                        className="bg-[#e50829] text-white font-medium border-none outline-none py-3 px-4
                            rounded-4xl cursor-pointer text-[15px] hover:bg-[#c1011e]"
                        disabled={loading}
                    >
                        {
                            loading
                                ? "Publishing..."
                                : isEditing
                                    ? "Done"
                                    : "Save"
                        }
                    </button>
                </div>

                {isEditing && previewImage ? (
                    <PinEditor previewImage={previewImage} />
                ) : (
                    < div
                        className="mt-8 flex justify-center gap-16 max-[1104px]:flex-col
                             max-[1104px]:items-center max-[1104px]:mb-16"
                    >
                        {/* UPLOAD */}
                        <div
                            className="relative bg-[#e9e9e9] text-[18px] flex items-center justify-center
                                rounded-4xl w-93.75 h-143.5 p-4 max-[475px]:w-full"
                        >
                            {previewImage && (
                                <div className="group relative w-93.75 h-143.5 max-[475px]:w-full ">
                                    <Image
                                        src={previewImage.url}
                                        alt="Pin Image"
                                        fill
                                        className="object-cover rounded-4xl"
                                    />

                                    <div
                                        className="hidden group-hover:block absolute w-full h-full top-0 left-0
                                            bg-[rgba(0,0,0,0.3)] rounded-4xl"
                                    />


                                    <div
                                        className="hidden group-hover:flex items-center gap-3 absolute top-2 right-4"
                                    >

                                        <label htmlFor="imgChange">
                                            <Image
                                                src="/replace.svg"
                                                alt="Replace Image"
                                                width={30}
                                                height={30}
                                                className="border border-gray-800 size-8 rounded-full
                                                    cursor-pointer text-red-500"
                                            />

                                            <input
                                                onChange={(e) => setMedia(e.target.files && e.target.files[0])}
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                id="imgChange"
                                            />
                                        </label>

                                        {/* <Image
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsEditing(true);
                                                setHasEdited(true);
                                            }}
                                            src="/edit.svg"
                                            alt="Edit Image"
                                            width={30}
                                            height={30}
                                            className="bg-white size-7.5 rounded-full cursor-pointer"
                                        /> */}
                                    </div>

                                    {media && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMedia(null);
                                                setPreviewImage({
                                                    url: pin.media,
                                                    width: pin.width,
                                                    height: pin.height
                                                });
                                            }}
                                            className="hidden group-hover:block absolute top-2 left-4
                                                font-semibold text-gray-800 hover:scale-101 cursor-pointer"
                                        >
                                            X
                                        </div>

                                    )}
                                </div>
                            )}
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
                                    id="tags"
                                />
                                <small className="text-[#a6a6a6] text-[13px]">
                                    Don&apos;t worry, people people won&apos;t see your tags
                                </small>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </AuthGuard >
    ) : (
        <Loader />
    )
}

export default EditPinWrapper