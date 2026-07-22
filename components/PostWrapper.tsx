"use client"

import Comments from "@/components/Comments";
import ImageKitWrapper from "@/components/ImageKitWrapper";
import PostInteractions from "@/components/PostInteractions";
import api from "@/lib/axios";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";

type Pin = {
    id: string;
    media: string;
    width: number;
    height: number;
    title: string;
    description: string;
    link: string;
    tags: string[];
    isSensitive: boolean;
    user: {
        id: string;
        username: string;
        email: string;
        avatar: string;
    };
};

const PostWrapper = () => {

    const { id } = useParams() as { id: string };

    const [pin, setPin] = useState<Pin | null>(null);
    const [revealed, setRevealed] = useState(false);

    const [expanded, setExpanded] = useState(false);

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

    if (!pin) return <Loader />

    const MAX_DESCRIPTION_LENGTH = 60;
    const isLongDescription = pin.description.length > MAX_DESCRIPTION_LENGTH; 

    const shortDescription = isLongDescription
        ? pin.description.slice(0, MAX_DESCRIPTION_LENGTH)
        : pin.description;

    return (
        <div className="flex justify-center max-[751]:gap-2 gap-8">
            <svg
                onClick={() => router.back()}
                height="20"
                viewBox="0 0 24 24"
                width="20"
                style={{ cursor: "pointer" }}
            >
                <path d="M8.41 4.59a2 2 0 1 1 2.83 2.82L8.66 10H21a2 2 0 0 1 0 4H8.66l2.58 2.59a2 2 0 1 1-2.82 2.82L1 12z">
                </path>
            </svg>

            {/* POST CONTAINER */}
            <div
                className="w-[70%] max-[1127px]:w-full max-[1127px]:mr-4 max-h-205 flex max-[751px]:flex-col
                    max-[751px]:max-h-none border border-[#e9e9e9] rounded-4xl overflow-hidden"
            >
                {/* POST IMAGE */}
                <div className="flex-1 bg-[#c0a68c]">
                    <ImageKitWrapper
                        src={pin.media || "/fallback.jpg"}
                        alt="Pin Image"
                        width={pin.width}
                        height={pin.height}
                        imgWidth={1260}
                        quality={90}
                        priority
                        className={`w-full h-full object-cover 
                            ${pin.isSensitive && !revealed
                                ? "blur-md md:blur-xl"
                                : ""}`}
                    />
                </div>

                <div className="flex-1 h-full flex flex-col gap-4 md:gap-8 p-2 md:p-4 overflow-hidden">
                    <div className="flex flex-col gap-2">
                        {pin.title && (
                            <h1 className="text-slate-700 text-base md:text-lg">{pin.title}</h1>
                        )}

                        {pin.description && (
                            <p className="text-sm md:text-base text-slate-600">
                                {expanded ? pin.description : shortDescription}

                                {!expanded && isLongDescription && "..."}

                                {" "}

                                {isLongDescription && (
                                    <button
                                        onClick={() => setExpanded(prev => !prev)}
                                        className="mt-1 text-xs font-medium text-slate-700
                                            hover:underline cursor-pointer"
                                    >
                                        {expanded ? "show less" : "show more"}
                                    </button>
                                )}
                            </p>
                        )}

                    </div>
                    <PostInteractions
                        pinId={id}
                        pinOwnerId={pin.user.id}
                        pinMedia={pin.media}
                        isSensitive={pin.isSensitive}
                        revealed={revealed}
                        setRevealed={setRevealed}
                    />
                    {/* POST USER */}
                    <Link href={`/profile/${pin.user.username}`} className="flex items-center gap-2 ">
                        <ImageKitWrapper
                            src={pin.user.avatar || "/general/noAvatar.png"}
                            alt="User Avatar"
                            width={32}
                            height={32}
                            imgWidth={32}
                            className="w-8 h-8 rounded-full aspect-square object-cover"
                            placeholder={false}
                        />
                        <span className="text-sm">{pin.user.username}</span>
                    </Link>

                    <Comments pinId={id} />
                </div>
            </div>
        </div>
    )
}

export default PostWrapper
