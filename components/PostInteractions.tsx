import { useEffect, useState } from "react"
import ImageKitWrapper from "./ImageKitWrapper"
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";

const PostInteractions = ({ pinId }: { pinId: string }) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

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

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
                <svg
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
                <ImageKitWrapper
                    src="/general/share.svg"
                    alt="React Icon"
                    width={20}
                    height={20}
                    imgWidth={20}
                    className="size-5 cursor-pointer"
                />
                <ImageKitWrapper
                    src="/general/more.svg"
                    alt="React Icon"
                    width={20}
                    height={20}
                    imgWidth={20}
                    className="size-5 cursor-pointer"
                />
            </div>
            <button
                className="bg-[#e50829] text-white border-none rounded-3xl px-4 py-3
                    text-sm font-bold cursor-pointer"
            >
                {saved ? "Saved" : "Save"}
            </button>
        </div>
    )
}

export default PostInteractions
