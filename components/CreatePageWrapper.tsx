"use client"

import Image from "next/image"
import AuthGuard from "./auth/AuthGuard"
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import PinEditor from "./pinEditor/PinEditor";

type Board = {
    id: string;
    title: string;
};

const CreatePageWrapper = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("CreatePageWrapper must be within AuthContextProvider");
    const { user } = authContext;

    const [media, setMedia] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoard, setSelectedBoard] = useState("");
    const [tags, setTags] = useState("");

    const [loading, setLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    const router = useRouter();

    useEffect(() => {
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

    const handleCreate = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        
        try {
            setLoading(true)

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("link", link);
            formData.append("board", selectedBoard);
            formData.append("tags", tags);

            if (media) {
                formData.append("media", media);
            }

            const {data} = await api.post("/pins/create", formData);
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

    return (
        <AuthGuard>
            <form onSubmit={handleCreate}>
                {/* CREATE TOP */}
                <div className="border-y border-[#e9e9e9] py-4 px-0 flex items-center justify-between">
                    <h1 className="text-[20px] font-medium">Create Pin</h1>
                    <button
                        type="submit"
                        className="bg-[#e50829] text-white font-medium border-none outline-none py-3 px-4
                        rounded-4xl cursor-pointer text-[15px] hover:bg-[#c1011e]"
                    >
                        {
                            loading
                                ? "Publishing..."
                                : isEditing
                                    ? "Done"
                                    : "Publish"
                        }
                    </button>
                </div>

                {isEditing ? (
                    <PinEditor />
                ) : (
                    < div
                        className="mt-8 flex justify-center gap-16 max-[1104px]:flex-col
                             max-[1104px]:items-center max-[1104px]:mb-16"
                    >
                        {/* UPLOAD */}
                        <div
                            className="bg-[#e9e9e9] cursor-pointer text-[18px] flex items-center justify-center
                                rounded-4xl border-dashed border-[#dddddd] w-93.75 h-143.5 p-4
                                relative max-[475px]:w-full"

                        >
                            {media ? (
                                <div className="relative w-93.75 h-143.5 max-[475px]:w-full">
                                    <Image
                                        src={URL.createObjectURL(media)}
                                        alt="Preview Image"
                                        fill
                                        className="object-cover rounded-4xl"
                                    />
                                    <div
                                        onClick={() => setIsEditing(true)}
                                        className="absolute top-4 right-4 bg-white flex items-center justify-center
                                            p-1.5 rounded-full cursor-pointer w-10 h-10"
                                    >
                                        <Image
                                            src="/edit.svg"
                                            alt="Edit Image"
                                            width={40}
                                            height={40}
                                        />
                                    </div>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); setMedia(null); }}
                                        className="absolute top-4 left-4 font-semibold text-gray-800 
                                            hover:scale-101 cursor-pointer"
                                    >
                                        X
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <label
                                        htmlFor="media"
                                        className="relative flex flex-col items-center gap-4 cursor-pointer group"
                                    >
                                        {/* {media && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setMedia(null); }}
                                                className="absolute top-0 right-1 font-semibold text-gray-800 hidden
                                                    group-hover:block hover:scale-101 cursor-pointer"
                                            >
                                                X
                                            </button>
                                        )} */}

                                        <input
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setMedia(e.target.files[0])
                                                }
                                            }}
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            id="media"
                                            hidden
                                        />
                                        <Image
                                            src="/upload.svg"
                                            alt="Upload Image"
                                            width={32}
                                            height={32}
                                            className={media ? "w-30 h-30" : "w-8 h-8"}
                                        />
                                        <span>Chose a file</span>
                                    </label>
                                    <div className="absolute bottom-8 text-[13px] text-center text-gray-600">
                                        We recommend uing high quality .jpg files less then 20 files less then 200 MB
                                    </div>
                                </>
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
                )}
            </form>
        </AuthGuard >
    )
}

export default CreatePageWrapper