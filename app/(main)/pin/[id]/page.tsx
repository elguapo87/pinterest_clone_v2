import Comments from "@/components/Comments";
import ImageKitWrapper from "@/components/ImageKitWrapper";
import PostInteractions from "@/components/PostInteractions";
import Link from "next/link";

const Post = () => {
    const post = {
        media: "/pinterest_clone/pins/pin1.jpeg",
        width: 1260,
        height: 1000,
    };

    return (
        <div className="flex justify-center max-[751]:gap-2 gap-8">
            <svg
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
                        src={post.media}
                        alt="Pin Image"
                        width={post.width}
                        height={post.height}
                        imgWidth={1260}
                        quality={90}
                        priority
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 h-full flex flex-col gap-8 p-4 overflow-hidden">
                    <PostInteractions />
                    {/* POST USER */}
                    <Link href="/john" className="flex items-center gap-2 ">
                        <ImageKitWrapper
                            src="/general/noAvatar.png"
                            alt="User Avatar"
                            width={32}
                            height={32}
                            imgWidth={32}
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">John Doe</span>
                    </Link>

                    <Comments />
                </div>
            </div>
        </div>
    )
}

export default Post
