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
import { EditorContext, initialCanvasOptions, initialTextOptions } from "@/context/EditorContext";
import { renderPin } from "@/lib/renderPin";

type Board = {
    id: string;
    title: string;
};

const CreatePageWrapper = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("CreatePageWrapper must be within AuthContextProvider");
    const { user } = authContext;

    const editorContext = useContext(EditorContext);
    if (!editorContext) throw new Error("CreatePageWrapper must be within EditorContextProvider");
    const { textOptions, canvasOptions, setTextOptions, setCanvasOptions } = editorContext;

    const [media, setMedia] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [boards, setBoards] = useState<Board[]>([]);
    const [selectedBoard, setSelectedBoard] = useState("");
    const [tags, setTags] = useState("");
    const [isSensitive, setIsSensitive] = useState(false);

    const [renderedFile, setRenderedFile] = useState<File | null>(null);
    const [renderedPreview, setRenderedPreview] = useState<string | null>(null);

    const [originalImage, setOriginalImage] = useState<{
        url: string;
        width: number;
        height: number;
    } | null>(null);

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

    const handleCreate = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if (isEditing) {
            if (!previewImage) return;

            const file = await renderPin({
                image: previewImage,
                textOptions,
                canvasOptions,
            });

            const url = URL.createObjectURL(file);

            const img = new window.Image();

            img.onload = () => {
                setRenderedFile(file);

                setPreviewImage({
                    url,
                    width: img.width,
                    height: img.height,
                });

                setRenderedPreview(url);
                setHasEdited(true);
                setIsEditing(false);
            };

            img.src = url;

        } else {
            try {
                setLoading(true)

                const formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("link", link);
                formData.append("board", selectedBoard);
                formData.append("tags", tags);
                formData.append("isSensitive", String(isSensitive));

                if (hasEdited) {
                    formData.append("textOptions", JSON.stringify(textOptions));
                    formData.append("canvasOptions", JSON.stringify(canvasOptions));
                }

                if (!media || !previewImage) {
                    toast.error("Please select an image");
                    return;
                }

                const fileToUpload = renderedFile ?? media;

                formData.append("media", fileToUpload);

                const { data } = await api.post("/pins/create", formData);
                if (data.success) {
                    setTextOptions(initialTextOptions);
                    setCanvasOptions(initialCanvasOptions);

                    setMedia(null);
                    setPreviewImage(null);
                    setHasEdited(false);
                    setIsEditing(false);

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
            const image = {
                url: imageUrl,
                width: img.width,
                height: img.height,
            };

            setOriginalImage(image);
            setPreviewImage(image);
        };

        return () => {
            URL.revokeObjectURL(imageUrl);
        }

    }, [media]);

    const cancelChanges = () => {
        const confirm = window.confirm("Are you sure? All chnages will be lost.");
        if (!confirm) return;

        if (renderedPreview) {
            URL.revokeObjectURL(renderedPreview);
        }
        setRenderedFile(null);
        setRenderedPreview(null);

        setPreviewImage(originalImage);

        setTextOptions(initialTextOptions);
        setCanvasOptions(initialCanvasOptions);

        setIsEditing(false);
        setHasEdited(false);
    };

    return (
        <AuthGuard>
            <form onSubmit={handleCreate}>
                {/* CREATE TOP */}
                <div className="border-y border-[#e9e9e9] py-4 px-0 flex items-center justify-between">
                    <h1 className="text-[20px] font-medium">{isEditing ? "Design your Pin" : "Create Pin"}</h1>

                    <div className="flex items-center gap-2 md:gap-3">
                        {isEditing && (
                            <div
                                onClick={cancelChanges}
                                className="text-black border border-black font-medium px-3.5 py-1.75
                                    flex items-center rounded-full cursor-pointer text-[15px] 
                                    hover:bg-[#e50829] hover:text-white hover:border-none"
                            >
                                X
                            </div>
                        )}

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
                                        : "Publish"
                            }
                        </button>
                    </div>

                </div>

                {isEditing && previewImage ? (
                    <PinEditor previewImage={originalImage} />
                ) : (
                    < div
                        className="mt-8 flex justify-center gap-16 max-[1104px]:flex-col
                             max-[1104px]:items-center max-[1104px]:mb-16"
                    >
                        <div className="flex flex-col items-center gap-5">
                            {/* UPLOAD */}
                            <div
                                className="bg-[#e9e9e9] cursor-pointer text-[18px] flex items-center justify-center
                                rounded-4xl border-dashed border-[#dddddd] w-93.75 h-143.5 p-4
                                relative max-[475px]:w-full"

                            >
                                {media ? (
                                    <div
                                        className="relative w-93.75 rounded-4xl overflow-hidden"
                                        style={{
                                            aspectRatio:
                                                canvasOptions.width && canvasOptions.height
                                                    ? `${canvasOptions.width} / ${canvasOptions.height}`
                                                    : previewImage
                                                        ? `${previewImage.width} / ${previewImage.height}`
                                                        : "1 / 1",
                                            backgroundColor: canvasOptions.backgroundColor,
                                        }}
                                    >
                                        {(renderedPreview || previewImage?.url) && (
                                            <Image
                                                src={renderedPreview || previewImage!.url}
                                                alt="Preview Image"
                                                fill
                                                className="object-contain rounded-4xl max-h-fit"
                                            />
                                        )}
                                        <div
                                            onClick={() => {
                                                setIsEditing(true);
                                                // setHasEdited(true);
                                            }}
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMedia(null);
                                                setRenderedFile(null);
                                                setRenderedPreview(null);
                                                setTextOptions(initialTextOptions);
                                                setCanvasOptions(initialCanvasOptions);
                                            }}
                                            className="absolute top-4 left-4 font-semibold text-gray-800 
                                                hover:scale-101 cursor-pointer text-xl size-10 bg-stone-100
                                                rounded-full flex items-center justify-center border border-gray-200"
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
                                            <input
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

                                                    if (file.size > MAX_FILE_SIZE) {
                                                        toast.error("Image must be smaller than 10 MB.");
                                                        e.target.value = "";
                                                        return;
                                                    }

                                                    setMedia(file);
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
                                            We recommend high-quality JPG or PNG images under 10 MB.
                                        </div>
                                    </>
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
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (value === "create-board") {
                                            router.push("/boards/create");
                                            return;
                                        }

                                        setSelectedBoard(value);
                                    }}
                                    value={selectedBoard}
                                    id="board"
                                    className="text-[15px] border-2 border-[#e9e9e9] p-4 rounded-2xl"
                                >
                                    <option value="create-board">+ Create new board</option>
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