import Image from 'next/image';
import Link from 'next/link';
import ImageKitWrapper from './ImageKitWrapper';

type GalleryProps = {
    id: number;
    media: string;
    width: number;
    height: number;
};

const GalleryItem = ({ item }: { item: GalleryProps }) => {
    return (
        <div className="flex relative group" style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}>
            <ImageKitWrapper 
                src={item.media}
                alt="Pin Image"
                width={item.width}
                height={item.height}
                className="w-full rounded-2xl object-cover"
                imgWidth={400}
            />

            <Link
                href={`/pin/${item.id}`}
                className="hidden group-hover:block absolute w-full h-full top-0 left-0
                    bg-[rgba(0,0,0,0.3)] rounded-2xl"
            />

            <button
                className="hidden group-hover:block bg-[#e50829] text-white rounded-3xl
                    py-3 px-4 font-medium cursor-pointer w-max absolute top-4 right-4
                    border-none text-sm"
            >
                Save
            </button>

            <div className="hidden group-hover:flex items-center gap-2 absolute bottom-4 right-4">
                <button
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center
                        border-none cursor-pointer hover:bg-[#f1f1f1]"
                >
                    <Image src="/share.svg" alt="Share" width={20} height={20} className="w-5 h-5" />
                </button>
                <button
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center
                        border-none cursor-pointer hover:bg-[#f1f1f1]"
                >
                    <Image src="/more.svg" alt="Share" width={20} height={20} className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default GalleryItem
