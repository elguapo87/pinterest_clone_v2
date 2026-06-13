import ImageKitWrapper from "./ImageKitWrapper"

const PostInteractions = () => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
                <ImageKitWrapper
                    src="/pinterest_clone/general/react.svg"
                    alt="React Icon"
                    width={24}
                    height={24}
                    imgWidth={24}
                    className="size-6 cursor-pointer"
                />
                273
                <ImageKitWrapper
                    src="/general/share.svg"
                    alt="React Icon"
                    width={24}
                    height={24}
                    imgWidth={24}
                    className="size-6 cursor-pointer"
                />
                <ImageKitWrapper
                    src="/general/more.svg"
                    alt="React Icon"
                    width={24}
                    height={24}
                    imgWidth={24}
                    className="size-6 cursor-pointer"
                />
            </div>
            <button
                className="bg-[#e50829] text-white border-none rounded-3xl px-4 py-3
                    text-sm font-bold cursor-pointer"
            >
                Save
            </button>
        </div>
    )
}

export default PostInteractions
