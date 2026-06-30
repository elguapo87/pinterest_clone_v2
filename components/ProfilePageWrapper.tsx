"use client"

import { useContext, useEffect, useState } from "react";
import ImageKitWrapper from "./ImageKitWrapper";
import Image from "next/image";
import Gallery from "./Gallery";
import Collection from "./Collection";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { AuthContext } from "@/context/AuthContext";

type Profile = {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    pins: {
        boardId: string;
        id: string;
        media: string;
        width: number;
        height: number;
        title: string;
        description: string;
        link?: string;
        tags: string[];
    }[];
    boards: {
        id: string;
        title: string;
        userId: string;
        createdAt: string;
        pins: {
            id: string;
            media: string;
            width: number;
            height: number;
        }[];
        _count: {
            pins: number;
        };
    }[];
};

const ProfilePageWrapper = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("ProfilePageWrapper must be within AuthContextProvider");
    const { user } = authContext;

    const { username } = useParams() as { username: string };

    const [profile, setProfile] = useState<Profile | null>(null);
    const [type, setType] = useState("saved");

    const [loading, setLoading] = useState(false);

    const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingsCount, setFollowingsCount] = useState(0);
    const [loadingFollow, setLoadingFollow] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!username) return;

        const fetchUser = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/user/${username}`);

                if (data.success) {
                    setProfile(data.profile);
                    setIsFollowing(data.isFollowing);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]);

    useEffect(() => {
        if (!username) return;

        const fetchFollowData = async () => {
            try {
                const { data } = await api.get(`/user/count?username=${username}`);

                if (data.success) {
                    setFollowersCount(data.followersCount);
                    setFollowingsCount(data.followingsCount)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                }
            }
        };

        fetchFollowData();
    }, [username]);

    const handleFollow = async () => {
        if (!user) {
            toast.error("You must be logged in to follow this user.");
            return;
        }

        const prevState = isFollowing;
        setIsFollowing(prev => !prev);

        setLoadingFollow(true);

        if (isFollowing) {
            setFollowersCount(prev => prev - 1);
        } else {
            setFollowersCount(prev => prev + 1);
        }

        try {
            const { data } = await api.post(`/user/follow?username=${username}`);

            if (data.success) {
                setIsFollowing(data.isFollowing);
            }
        } catch (error) {
            setIsFollowing(prevState);

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        } finally {
            setLoadingFollow(false);
        }
    };

    const handleOpenChat = () => {
        if (!user) {
            toast.error("You must be logged in to send a message.");
            return;
        }

        router.push(`/messages/${profile?.id}`)
    };

    if (!profile && loading) return null;

    return profile ? (
        <div className="flex flex-col items-center gap-4">
            <ImageKitWrapper
                src={profile.avatar || "/general/noAvatar.png"}
                alt="User Avatar"
                width={100}
                height={100}
                imgWidth={100}
                className="size-25 rounded-full object-cover"
            />
            <h1 className="text-4xl font-medium">{profile.username}</h1>
            <span className="font-light text-gray-600">@{profile.displayName}</span>
            <div className="font-medium">
                {followersCount} {followersCount === 1 ? "follower" : "followers"} &bull; {""}
                {followingsCount} {followingsCount === 1 ? "following" : "followings"}
            </div>
            {/* PROFILE INTERACTIONS */}
            <div className="flex items-center gap-8">
                <Image src="/share.svg" alt="Share Icon" width={22} height={22} />
                {/* PROFILE BUTTONS */}
                <div className="flex gap-4">
                    {user?.id !== profile.id && (
                        <button
                            onClick={handleOpenChat}
                            className="border-none p-4 rounded-4xl font-bold cursor-pointer bg-stone-200"
                        >
                            Message
                        </button>
                    )}
                    {user?.id !== profile.id && (
                        <button
                            onClick={handleFollow}
                            className={`border-none p-4 rounded-4xl font-bold cursor-pointer bg-[#e50829]
                                text-white hover:bg-[#c1011e] ${loadingFollow
                                    ? "cursor-not-allowed opacity-[0.5]"
                                    : ""}`}
                            disabled={loadingFollow}
                        >
                            {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                    )}
                </div>
                <Image src="/more.svg" alt="More Icon" width={22} height={22} />
            </div>

            {/* PROFILE OPTIONS */}
            <div className="flex gap-4 mt-8 mb-4 font-medium">
                <span
                    onClick={() => setType("created")}
                    className={`cursor-pointer py-1 px-0 hover:text-gray-600 
                        ${type === "created" ? "border-b-3 border-black" : ""}`}
                >
                    Created
                </span>
                <span
                    onClick={() => setType("saved")}
                    className={`cursor-pointer py-1 px-0 hover:text-gray-600 
                        ${type === "saved" ? "border-b-3 border-black" : ""}`}
                >
                    Boards
                </span>
            </div>

            {type === "created" ? (
                <Gallery initialPins={profile.pins} />
            ) : (
                <Collection boards={profile.boards} />
            )}
        </div>
    ) : (
        <Loader />
    )
}

export default ProfilePageWrapper
