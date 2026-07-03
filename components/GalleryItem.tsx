import Image from 'next/image';
import Link from 'next/link';
import ImageKitWrapper from './ImageKitWrapper';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import api from '@/lib/axios';
import axios from 'axios';
import toast from 'react-hot-toast';

type GalleryProps = {
    pin: {
        id: string;
        media: string;
        width: number;
        height: number;
    }
    fetchSaves?: () => Promise<void>;
};

const GalleryItem = ({ pin, fetchSaves }: GalleryProps) => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("GalleryItem must be within AuthContextProvider");
    const { user } = authContext;

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!pin.id) return

        const checkInteractions = async () => {
            try {
                const { data } = await api.get("/pins/interactionsCheck", {
                    params: {
                        pinId: pin.id
                    }
                });

                if (data.success) {
                    setSaved(data.saved);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                }
            }
        };

        checkInteractions();
    }, [pin.id]);

    const handleSave = async () => {
        try {
            if (!user) {
                toast.error("You must login to save a pin");
                return;
            }

            const { data } = await api.post("/pins/save", {
                pinId: pin.id
            });

            if (data.success) {
                setSaved(data.saved);
                await fetchSaves?.();
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    const handleDownload = async () => {
        if (!pin.media) return;

        try {
            const response = await fetch(pin.media);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `pin-${pin.id}.png`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

        } catch (error) {
            toast.error("Failed to download image");
        }
    };

    const handleShare = () => {
        const frontendUrl = window.location.origin;
        const pinUrl = `${frontendUrl}/pin/${pin.id}`;

        if (navigator.share) {
            navigator.share({ url: pinUrl, text: "Check out this image" });
        } else {
            alert("Share not supported on this browser.");
        }
    };

    return (
        <div className="flex relative group" style={{ gridRowEnd: `span ${Math.ceil(pin.height / 100)}` }}>
            <ImageKitWrapper
                src={pin.media}
                alt="Pin Image"
                width={pin.width}
                height={pin.height}
                className="w-full rounded-2xl object-cover"
                imgWidth={400}
            />

            <Link
                href={`/pin/${pin.id}`}
                className="hidden group-hover:block absolute w-full h-full top-0 left-0
                    bg-[rgba(0,0,0,0.3)] rounded-2xl"
            />

            <button
                onClick={handleSave}
                className="hidden group-hover:block bg-[#e50829] text-white rounded-3xl
                    py-3 px-4 font-medium cursor-pointer w-max absolute top-4 right-4
                    border-none text-sm"
            >
                {saved ? "Saved" : "Save"}
            </button>

            <div className="hidden group-hover:flex items-center gap-2 absolute bottom-4 right-4">
                <button
                    onClick={handleShare}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center
                        border-none cursor-pointer hover:bg-[#f1f1f1]"
                >
                    <Image src="/share.svg" alt="Share" width={20} height={20} className="w-5 h-5" />
                </button>
                <button
                    onClick={handleDownload}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center
                        border-none cursor-pointer hover:bg-[#f1f1f1]"
                >
                    <Image src="/download.svg" alt="Download" width={20} height={20} className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default GalleryItem
