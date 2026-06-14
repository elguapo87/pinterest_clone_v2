import ImageKitWrapper from "./ImageKitWrapper"

const Collection = () => {
    return (
        <div
            className="w-full grid max-[475px]:grid-cols-1 max-[798px]:grid-cols-2 max-[1035px]:grid-cols-3
                max-[1272px]:grid-cols-4 max-[1509px]:grid-cols-5 max-[1746px]:grid-cols-6
                min-[1746px]:grid-cols-7 gap-4"
        >
            {/* COLLECTION */}
            <div className="mb-8 cursor-pointer">
                <ImageKitWrapper
                    src="/pinterest_clone/pins/pin1.jpeg"
                    alt="Pin-Image"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-2xl"
                    imgWidth={400}
                />
                {/* COLLECTION INFO */}
                <div className="flex flex-col gap-0.5">
                    <h1 className="font-medium text-base">Minimalist Bedrooms</h1>
                    <span className="text-gray-600 text-xs">12 Pins &bull; 1 week ago</span>
                </div>
            </div>
            {/* COLLECTION */}
            <div className="mb-8 cursor-pointer">
                <ImageKitWrapper
                    src="/pinterest_clone/pins/pin1.jpeg"
                    alt="Pin-Image"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-2xl"
                    imgWidth={400}
                />
                {/* COLLECTION INFO */}
                <div className="flex flex-col gap-0.5">
                    <h1 className="font-medium text-base">Minimalist Bedrooms</h1>
                    <span className="text-gray-600 text-xs">12 Pins &bull; 1 week ago</span>
                </div>
            </div>
            {/* COLLECTION */}
            <div className="mb-8 cursor-pointer">
                <ImageKitWrapper
                    src="/pinterest_clone/pins/pin1.jpeg"
                    alt="Pin-Image"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-2xl"
                    imgWidth={400}
                />
                {/* COLLECTION INFO */}
                <div className="flex flex-col gap-0.5">
                    <h1 className="font-medium text-base">Minimalist Bedrooms</h1>
                    <span className="text-gray-600 text-xs">12 Pins &bull; 1 week ago</span>
                </div>
            </div>
            {/* COLLECTION */}
            <div className="mb-8 cursor-pointer">
                <ImageKitWrapper
                    src="/pinterest_clone/pins/pin1.jpeg"
                    alt="Pin-Image"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-2xl"
                    imgWidth={400}
                />
                {/* COLLECTION INFO */}
                <div className="flex flex-col gap-0.5">
                    <h1 className="font-medium text-base">Minimalist Bedrooms</h1>
                    <span className="text-gray-600 text-xs">12 Pins &bull; 1 week ago</span>
                </div>
            </div>
            {/* COLLECTION */}
            <div className="mb-8 cursor-pointer">
                <ImageKitWrapper
                    src="/pinterest_clone/pins/pin1.jpeg"
                    alt="Pin-Image"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover rounded-2xl"
                    imgWidth={400}
                />
                {/* COLLECTION INFO */}
                <div className="flex flex-col gap-0.5">
                    <h1 className="font-medium text-base">Minimalist Bedrooms</h1>
                    <span className="text-gray-600 text-xs">12 Pins &bull; 1 week ago</span>
                </div>
            </div>
        </div>
    )
}

export default Collection
