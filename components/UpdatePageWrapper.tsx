"use client"

import api from "@/lib/axios";
import axios from "axios";
import Image from "next/image"
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react"
import toast from "react-hot-toast";
import Loader from "./Loader";
import Gallery from "./Gallery";
import { AuthContext } from "@/context/AuthContext";
import Collection from "./Collection";
import { format } from "timeago.js";

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
        isSensitive: boolean;
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
            isSensitive: boolean;
        }[];
        _count: {
            pins: number;
        };
    }[];
};

type SavedPin = {
    pin: {
        id: string;
        media: string;
        width: number;
        height: number;
        isSensitive: boolean;
    };
};

const UpdatePageWrapper = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("UserButton must be within AuthContextProvider");
    const { setUser } = authContext;

    const { username: profileUsername } = useParams() as { username: string };

    const [profile, setProfile] = useState<Profile | null>(null);
    const [type, setType] = useState("created");
    const [loading, setLoading] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingsCount, setFollowingsCount] = useState(0);

    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("")
    const [avatar, setAvatar] = useState<File | null>(null);

    const [editingField, setEditingField] = useState<"username" | "displayName" | "avatar" | null>(null);
    const [savedPins, setSavedPins] = useState<SavedPin[]>([]);

    const router = useRouter();

    const fetchUser = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/user/${profileUsername}`);

            if (data.success) {
                setProfile(data.profile);
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
        if (!profileUsername) return;

        fetchUser();
    }, [profileUsername]);

    useEffect(() => {
        if (!profile) return

        setUsername(profile.username);
        setDisplayName(profile.displayName);
    }, [profile]);

    useEffect(() => {
        if (!profileUsername) return;

        const fetchFollowingData = async () => {
            try {
                const { data } = await api.get(`/user/count?username=${profileUsername}`);

                if (data.success) {
                    setFollowersCount(data.followersCount);
                    setFollowingsCount(data.followingsCount);
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                }
            }
        };

        fetchFollowingData();
    }, [profileUsername]);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            if (username.trim()) {
                formData.append("username", username);
            }

            if (displayName.trim()) {
                formData.append("displayName", displayName);
            }

            if (avatar) {
                formData.append("avatar", avatar);
            }

            const { data } = await api.put("/user/update", formData);

            if (data.success) {
                toast.success(data.message);
                setEditingField(null);
                setUsername("");
                setDisplayName("");
                setAvatar(null);

                setProfile((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        username: data.user.username,
                        displayName: data.user.displayName,
                        avatar: data.user.avatar
                    };
                });

                setUser((prev) => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        username: data.user.username,
                        displayName: data.user.displayName,
                        avatar: data.user.avatar
                    }
                })

                if (data.user.username !== profile?.username) {
                    router.push(`/profile/edit/${data.user.username}`);
                }
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    const fetchSaves = async () => {
        try {
            const { data } = await api.get("/pins/savedPins");

            if (data.success) {
                setSavedPins(data.savedPins);
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    useEffect(() => {
        fetchSaves();
    }, []);

    const saved = savedPins.map((save) => save.pin);

    if (!profile && loading) return null;

    return profile ? (
        <div className="flex flex-col items-center gap-4">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <div className="relative group size-25">
                    <Image
                        src={
                            avatar
                                ? URL.createObjectURL(avatar)
                                : profile.avatar || "/noAvatar.png"
                        }
                        alt="User Avatar"
                        width={100}
                        height={100}
                        className="size-25 rounded-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 
                            group-hover:opacity-100 transition-opacity duration-200"
                    />

                    <label
                        htmlFor="avatarUpload"
                        className="absolute inset-0 flex items-center justify-center opacity-0 
                            group-hover:opacity-100 transition-opacity duration-200
                            cursor-pointer"
                    >
                        <Image
                            src="/upload.svg"
                            alt="Upload Icon"
                            width={30}
                            height={30}
                            className="z-10"
                        />
                    </label>
                    <input
                        onChange={(e) => {
                            if (e.target.files) {
                                setAvatar(e.target.files[0]);
                            }

                            setEditingField("avatar");
                        }}
                        id="avatarUpload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                    />

                    {avatar && (
                        <div
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingField(null);
                                setAvatar(null);
                            }}
                            className="absolute top-0 right-0 translate-x-1.5 -translate-y-1.5 text-[15px] text-black
                                font-semibold cursor-pointer hover:scale-105 transition-all duration-200"
                        >
                            X
                        </div>
                    )}
                </div>

                {editingField === "username" ? (
                    <div className="flex items-center gap-3">
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            type="text"
                            className="border-b border-gray-600 outline-none"
                        />
                        <div
                            onClick={() => setEditingField(null)}
                            className="flex items-center justify-center size-4 rounded-full p-3 text-sm 
                                font-normal bg-stone-200 cursor-pointer hover:font-semibold 
                                hover:bg-stone-300 transition-all duration-200 "
                        >
                            X
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-medium">{profile.username}</h1>
                        <div
                            className="border-none outline-none bg-green-600 text-stone-50 rounded-lg 
                                px-2.5 py-0.75 cursor-pointer hover:bg-green-500 hover:text-white
                                transition-all duration-300 text-sm"
                            onClick={() => setEditingField("username")}
                        >
                            Edit
                        </div>
                    </div>
                )}

                {editingField === "displayName" ? (
                    <div className="flex items-center gap-3">
                        <input
                            onChange={(e) => setDisplayName(e.target.value)}
                            value={displayName}
                            type="text"
                            className="border-b border-gray-600 outline-none"
                        />
                        <div
                            onClick={() => setEditingField(null)}
                            className="flex items-center justify-center size-4 rounded-full p-3 text-sm 
                                font-normal bg-stone-200 cursor-pointer hover:font-semibold 
                                hover:bg-stone-300 transition-all duration-200 "
                        >
                            X
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="font-light text-gray-600">@{profile?.displayName}</span>
                        <div
                            className="border-none outline-none bg-green-600 text-stone-50 rounded-lg 
                                    px-2.5 py-0.75 cursor-pointer hover:bg-green-500 hover:text-white
                                    transition-all duration-300 text-sm"
                            onClick={() => setEditingField("displayName")}
                        >
                            Edit
                        </div>
                    </div>
                )}

                <span className="font-light text-sm text-gray-500">Joined {format(profile.createdAt)}</span>

                {editingField !== null && (
                    <button
                        type="submit"
                        className="border-none outline-none bg-green-600 text-stone-50 rounded-lg 
                            px-3 py-1 cursor-pointer hover:bg-green-500 hover:text-white
                            transition-all duration-300 w-[60%]"
                    >
                        Save
                    </button>
                )}
            </form>

            <div className="font-medium">
                {followersCount} {followersCount === 1 ? "follower" : "followers"} &bull; {""}
                {followingsCount} {followingsCount === 1 ? "following" : "followings"}
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
                    Saved
                </span>
                <span
                    onClick={() => setType("boards")}
                    className={`cursor-pointer py-1 px-0 hover:text-gray-600 
                        ${type === "boards" ? "border-b-3 border-black" : ""}`}
                >
                    Boards
                </span>
            </div>

            {type === "created" && (
                <Gallery key="created" initialPins={profile.pins} fetchSaves={fetchSaves} />
            )}

            {type === "saved" && (
                saved.length > 0 ? (
                    <Gallery key="saved" initialPins={saved} fetchSaves={fetchSaves} />
                ) : (
                    <h1>No saved pins</h1>
                )
            )}

            {type === "boards" && (
                <Collection boards={profile.boards} />
            )}

        </div>
    ) : (
        <Loader />
    )
}

export default UpdatePageWrapper
