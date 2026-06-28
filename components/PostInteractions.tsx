import { useContext, useEffect, useRef, useState } from "react"
import ImageKitWrapper from "./ImageKitWrapper"
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useClickOutside } from "@/hooks/clickOutside";

type PostWrapperProps = {
    pinId: string;
    pinOwnerId: string;
    pinMedia: string
}

const PostInteractions = ({ pinId, pinOwnerId, pinMedia }: PostWrapperProps) => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("PostInteractions must be within AuthContextProvider");
    const { user } = authContext;

    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    const router = useRouter();
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!pinId) return;

        const fetchInteractions = async () => {
            try {
                const { data } = await api.get("/pins/interactionsCheck", {
                    params: {
                        pinId
                    }
                });

                if (data.success) {
                    setLiked(data.liked);
                    setSaved(data.saved);
                    setLikesCount(data.likesCount);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                }
            }
        };

        fetchInteractions();
    }, [pinId]);

    const handleLike = async () => {
        if (!user) {
            toast.error("You must login to like a pin");
            return;
        }

        try {
            const { data } = await api.post("/pins/like", { pinId });

            if (data.success) {
                setLiked(data.liked);
                setLikesCount(data.likesCount);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    const handleSave = async () => {
        if (!user) {
            toast.error("You must login to save a pin");
            return;
        }

        try {
            const { data } = await api.post("/pins/save", { pinId });

            if (data.success) {
                setSaved(data.saved);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    const handleDelete = async () => {
        try {
            const confirmation = window.confirm("Are you sure you want to delete this pin?");
            if (!confirmation) return;

            const { data } = await api.delete(`/pins/delete?pinId=${pinId}`);

            if (data.success) {
                toast.success(data.message);
                router.replace("/");
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    const handleDownload = async () => {
        if (!pinMedia) return;

        try {
            const response = await fetch(pinMedia);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `pin-${pinId}.png`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to download image");
        }
    };

    const handleShare = () => {
        const frontEndUrl = window.location.origin;
        const pinUrl = `${frontEndUrl}/pin/${pinId}`;

        if (navigator.share) {
            navigator.share({ url: pinUrl, text: "Check out this image" });
        } else {
            alert("Share not supported on this browser.")
        }
    };

    useClickOutside(menuRef, () => {
        setShowMenu(false);
    });

    return (
        <div className="flex items-center justify-between">
            <div className="relative flex items-center gap-2 font-medium">
                <svg
                    onClick={handleLike}
                    style={{ cursor: "pointer" }}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"

                >
                    <path
                        d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                        stroke={liked ? "#e50829" : "#000000"}
                        strokeWidth="2"
                        fill={liked ? "#e50829" : "none"}
                    />
                </svg>

                {likesCount}
                <Image
                    onClick={handleShare}
                    src="/share.svg"
                    alt="React Icon"
                    width={20}
                    height={20}
                    className="size-5 cursor-pointer"
                />
                <Image
                    onClick={() => setShowMenu(prev => !prev)}
                    src="/more.svg"
                    alt="React Icon"
                    width={20}
                    height={20}
                    className="size-5 cursor-pointer"
                />

                {showMenu && (
                    <div
                        ref={menuRef}
                        className="absolute flex flex-col items-start justify-center gap-2 
                            top-8 -right-7 bg-white shadow-lg rounded-xl p-3 z-50 text-sm"
                    >
                        <button
                            onClick={handleDownload}
                            className="cursor-pointer hover:text-black hover:scale-101 flex items-center gap-1"
                        >
                            <Image
                                src="/download.svg"
                                alt="Download Icon"
                                width={16}
                                height={16}
                                className="size-4"
                            />
                            Download
                        </button>
                        {user?.id === pinOwnerId && (
                            <button
                                onClick={handleDelete}
                                className="cursor-pointer hover:text-black hover:scale-101 flex items-center gap-1"
                            >
                                <Image
                                    src="/delete.svg"
                                    alt="Delete Icon"
                                    width={16}
                                    height={16}
                                    className="size-4"
                                />
                                Delete
                            </button>

                        )}
                    </div>
                )}
            </div>
            <button
                onClick={handleSave}
                className="bg-[#e50829] text-white border-none rounded-3xl px-4 py-3
                    text-sm font-bold cursor-pointer"
            >
                {saved ? "Saved" : "Save"}
            </button>
        </div>
    )
}

export default PostInteractions
