"use client"

import { useState } from "react";
import ImageKitWrapper from "./ImageKitWrapper";
import Image from "next/image";
import Gallery from "./Gallery";
import Collection from "./Collection";

const ProfilePageWrapper = () => {

    const [type, setType] = useState("saved");

    return (
        <div className="flex flex-col items-center gap-4">
            <ImageKitWrapper
                src="/general/noAvatar.png"
                alt="User Avatar"
                width={100}
                height={100}
                imgWidth={100}
                className="size-25 rounded-full object-cover"
            />
            <h1 className="text-4xl font-medium">John Doe</h1>
            <span className="font-light text-gray-600">@johndoe</span>
            <div className="font-medium">10 followers &bull; 20 followings</div>
            {/* PROFILE INTERACTIONS */}
            <div className="flex items-center gap-8">
                <Image src="/share.svg" alt="Share Icon" width={22} height={22} />
                {/* PROFILE BUTTONS */}
                <div className="flex gap-4">
                    <button className="border-none p-4 rounded-4xl font-bold cursor-pointer bg-stone-200">
                        Message
                    </button>
                    <button
                        className="border-none p-4 rounded-4xl font-bold cursor-pointer bg-[#e50829] text-white
                            hover:bg-[#c1011e]"
                    >
                        Follow
                    </button>
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
                    Collection
                </span>
            </div>

            {type === "created" ? (
                <Gallery />
            ) : (
                <Collection />
            )}
        </div>
    )
}

export default ProfilePageWrapper
