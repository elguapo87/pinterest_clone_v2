"use client"

import Image from "next/image"
import UserButton from "./UserButton"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation";

const TopBar = () => {

    const [search, setSearch] = useState("");
    const [initialized, setInitialized] = useState(false);

    const router = useRouter();

    const searchParams = useSearchParams();
    
    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            return;
        }

        const debounce = setTimeout(() => {
            if (!search.trim()) {
                router.replace("/");
            } else {
                router.replace(`/search?search=${search}`);
            }
        }, 400);

        return () => clearTimeout(debounce);
    }, [search]);

    useEffect(() => {
        const param = searchParams.get("search") || "";
        setSearch(param);
    }, []);

    return (
        <div className="my-4 mx-0 flex items-center gap-4">
            {/* SEARCH */}
            <div className="flex-1 bg-[#f1f1f1] rounded-2xl p-4 flex items-center gap-4">
                <Image src="/search.svg" alt="Search" width={16} height={16} />
                <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    className="flex-1 bg-transparent border-none outline-none text-[18px]"
                    type="text"
                    placeholder="Search..."
                />
            </div>

            {/* USER */}
            <UserButton />
        </div>
    )
}

export default TopBar
