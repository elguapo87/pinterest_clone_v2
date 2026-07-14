"use client"

import { AuthContext } from "@/context/AuthContext";
import { useClickOutside } from "@/hooks/clickOutside";
import Image from "next/image";
import Link from "next/link";
import { useContext, useRef, useState } from "react"

const UserButton = ({ showSearch }: { showSearch: boolean }) => {

    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("UserButton must be within AuthContextProvider");
    const { user, logout } = authContext;

    const openRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    useClickOutside(openRef, () => {
        setOpen(false);
    });

    return (
        <div
            ref={openRef}
            className={` ${showSearch ? "ml-auto" : ""}`}
        >
            {user ? (
                <div className="relative flex items-center gap-2 md:gap-4">
                    <Image
                        src={user.avatar || "/noAvatar.png"}
                        alt="Avatar"
                        width={36}
                        height={36}
                        className="size-8 md:size-9 rounded-full object-cover"
                    />
                    <Image
                        onClick={() => setOpen(prev => !prev)}
                        src="/arrow.svg"
                        alt="Arrow"
                        width={16}
                        height={16}
                        className={`size-3 md:size-4 rounded-full object-cover cursor-pointer
                            ${open ? "rotate-180 transition-all ease-in-out duration-200" : ""}`}
                    />

                    {open && (
                        <div
                            className="absolute right-0 top-[120%] p-4 rounded-lg bg-white z-999 flex flex-col text-sm
                        shadow-[0px_0px_4px_1px_rgba(0,0,0,0.177)]"
                        >
                            <Link
                                href={`/profile/edit/${user.username}`}
                                className="cursor-pointer p-2 rounded-lg hover:bg-[#f1f1f1] text-gray-800"
                            >
                                Profile
                            </Link>
                            <div
                                onClick={logout}
                                className="cursor-pointer p-2 rounded-lg hover:bg-[#f1f1f1] text-gray-800"
                            >
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <Link href="/auth" className="text-sm md:text-[18px] md:p-4 rounded-4xl hover:bg-[#f1f1f1]">
                        Login<span className="max-md:hidden">{" "}</span><span>/</span><span className="max-md:hidden">{" "}</span>Sign Up
                    </Link>
                </div>
            )}

        </div>
    )
}

export default UserButton
