import Link from "next/link";
import ImageKitWrapper from "./ImageKitWrapper"
import { format } from "timeago.js"

type Board = {
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

const Collection = ({ boards }: { boards: Board }) => {

    console.log(boards);



    return (
        <div
            className="w-full grid max-[475px]:grid-cols-1 max-[798px]:grid-cols-2 max-[1035px]:grid-cols-3
                max-[1272px]:grid-cols-4 max-[1509px]:grid-cols-5 max-[1746px]:grid-cols-6
                min-[1746px]:grid-cols-7 gap-4"
        >
            {/* COLLECTION */}
            {boards.map((board) => {
                const firstPin = board.pins[0];

                console.log(firstPin);
                

                return (
                    <Link href={`/search?boardId=${board.id}`} key={board.id} className="mb-8 cursor-pointer">
                        <ImageKitWrapper
                            src={firstPin.media || "/pinterest_clone/general/empty-board.png"}
                            alt="Pin-Image"
                            width={400}
                            height={400}
                            className={`w-full h-full object-cover rounded-2xl ${firstPin.isSensitive ? "blur-md" : ""}`}
                            imgWidth={400}
                        />
                        {/* COLLECTION INFO */}
                        <div className="flex flex-col gap-0.5">
                            <h1 className="font-medium text-base">{board.title}</h1>
                            <span className="text-gray-600 text-xs">
                                {board._count.pins} Pins &bull; {format(board.createdAt)}
                            </span>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Collection
