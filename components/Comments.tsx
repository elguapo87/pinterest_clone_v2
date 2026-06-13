"use client"

import { useState } from "react"
import ImageKitWrapper from "./ImageKitWrapper"
import EmojiPicker from 'emoji-picker-react'

const Comments = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="flex-1 flex flex-col gap-4 min-h-0">
            {/* COMMENT LIST */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                {/* COUNT */}
                <span className="">5 comments</span>
                {/* COMMENT */}
                <div className="">
                    <ImageKitWrapper
                        src="/pinterest_clone/general/noAvatar.png"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        imgWidth={32}
                        className="w-8 h-8 rounded-full"
                    />
                    {/* COMMENT CONTENT */}
                    <div className="">
                        <span className="">John Doe</span>
                        <p className="">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi vero ipsam reprehenderit
                            cupiditate expedita necessitatibus doloremque, eaque non sit, eum provident
                        </p>
                        <span className="">1h ago</span>
                    </div>
                </div>
                {/* COMMENT */}
                <div className="">
                    <ImageKitWrapper
                        src="/general/noAvatar.png"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        imgWidth={32}
                        className="w-8 h-8 rounded-full"
                    />
                    {/* COMMENT CONTENT */}
                    <div className="">
                        <span className="">John Doe</span>
                        <p className="">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi vero ipsam reprehenderit
                            cupiditate expedita necessitatibus doloremque, eaque non sit, eum provident
                        </p>
                        <span className="">1h ago</span>
                    </div>
                </div>
                {/* COMMENT */}
                <div className="flex gap-4">
                    <ImageKitWrapper
                        src="/general/noAvatar.png"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        imgWidth={32}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    {/* COMMENT CONTENT */}
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">John Doe</span>
                        <p className="text-sm">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi vero ipsam reprehenderit
                            cupiditate expedita necessitatibus doloremque, eaque non sit, eum provident
                        </p>
                        <span className="text-xs text-[#a6a6a6]">1h ago</span>
                    </div>
                </div>
                {/* COMMENT */}
                <div className="">
                    <ImageKitWrapper
                        src="/general/noAvatar.png"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        imgWidth={32}
                        className="w-8 h-8 rounded-full"
                    />
                    {/* COMMENT CONTENT */}
                    <div className="">
                        <span className="">John Doe</span>
                        <p className="">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi vero ipsam reprehenderit
                            cupiditate expedita necessitatibus doloremque, eaque non sit, eum provident
                        </p>
                        <span className="">1h ago</span>
                    </div>
                </div>
            </div>

            {/* COMMENT FORM */}
            <form className="relative bg-[#f1f1f1] p-4 rounded-4xl items-center gap-4">
                <input
                    className="flex-1 border-none outline-none bg-transparent text-[16px]"
                    type="text"
                    placeholder="Add a comment"
                />
                {/* EMOJI */}
                <div className="cursor-pointer text-[20px] relative">
                    <div onClick={() => setOpen(prev => !prev)}>😀</div>

                    {open && (
                        <div
                            className="absolute right-0 bottom-12.5 max-[751]:bottom-3
                                max-[751px]:scale-70 max-[751px]:translate-x-[22%]"
                        >
                            <EmojiPicker />
                        </div>
                    )}

                </div>
            </form>
        </div>
    )
}

export default Comments
