import Gallery from "@/components/Gallery";
import LeftBar from "@/components/LeftBar";
import TopBar from "@/components/TopBar";
import { Suspense } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex gap-4 w-full">
            <LeftBar />
            <div className="flex-1 mr-4">
                <Suspense fallback={null}>
                    <TopBar />
                </Suspense>
                {children}
            </div>
        </div>
    )
}