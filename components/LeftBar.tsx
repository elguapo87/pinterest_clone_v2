"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react";

const LeftBar = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div
            className="h-screen sticky top-0 flex flex-col items-center justify-between 
            w-18 py-4 px-0 border-r border-[#e9e9e9] z-50"
        >
            <div
                className="flex flex-col items-center gap-10"
            >
                <Link
                    href="/"
                    className="size-12 flex items-center justify-center hover:bg-[#f1f1f1]"
                >
                    <Image src="/logo.png" alt="Logo" width={24} height={24} className="size-6" />
                </Link>
                <Link
                    href="/"
                    className="size-12 flex items-center justify-center hover:bg-[#f1f1f1]"
                >
                    <Image src="/home.svg" alt="Home" width={18} height={18} />
                </Link>
                <div onClick={() => setShowDropdown(prev => !prev)} className="relative">
                    <div
                        className="size-12 flex items-center justify-center 
                            hover:bg-[#f1f1f1] cursor-pointer"
                    >
                        <Image
                            src="/create.svg"
                            alt="Create"
                            width={18}
                            height={18}
                        />
                    </div>

                    {showDropdown && (
                        <div
                            className="absolute left-13 top-1/2 -translate-y-1/2
                                bg-white border border-[#e9e9e9] rounded-2xl shadow-lg
                                flex flex-col min-w-30 w-fit overflow-hidden text-start"
                        >
                            <Link
                                href="/create"
                                className="px-4 py-2.5 hover:bg-[#f1f1f1] text-sm"
                            >
                                Create Pin
                            </Link>

                            <Link
                                href="/boards/create"
                                className="px-4 py-2.5 hover:bg-[#f1f1f1] text-sm"
                            >
                                Create Board
                            </Link>
                        </div>
                    )}
                </div>
                <Link
                    href="/"
                    className="size-12 flex items-center justify-center hover:bg-[#f1f1f1]"
                >
                    <Image src="/updates.svg" alt="Updates" width={18} height={18} />
                </Link>
                <Link
                    href="/"
                    className="size-12 flex items-center justify-center hover:bg-[#f1f1f1]"
                >
                    <Image src="/messages.svg" alt="Messages" width={18} height={18} />
                </Link>
            </div>
        </div>
    )
}

export default LeftBar
