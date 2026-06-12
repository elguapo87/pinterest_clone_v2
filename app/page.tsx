import Gallery from "@/components/Gallery";
import LeftBar from "@/components/LeftBar";
import TopBar from "@/components/TopBar";

export default function Home() {
  return (
    <div className="flex gap-4 w-full ">
      <LeftBar />

      <div className="flex-1 mr-4">
        <TopBar />
        <Gallery />
      </div>
    </div>
  );
}
