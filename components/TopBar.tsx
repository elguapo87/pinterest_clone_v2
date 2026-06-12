import Image from "next/image"
import UserButton from "./UserButton"

const TopBar = () => {
    return (
        <div className="my-4 mx-0 flex items-center gap-4">
            {/* SEARCH */}
            <div className="flex-1 bg-[#f1f1f1] rounded-2xl p-4 flex items-center gap-4">
                <Image src="/search.svg" alt="Search" width={16} height={16} />
                <input
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
