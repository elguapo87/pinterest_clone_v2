import { useContext } from "react";
import ImageKitWrapper from "../ImageKitWrapper";
import { EditorContext } from "@/context/EditorContext";

type PinEditorProps = {
  url: string;
  width: number;
  height: number;
} | null;

const Layers = ({ previewImage }: { previewImage: PinEditorProps }) => {

  if (!previewImage) return

  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("Layers must be within EditorContextProvider");
  const { selectedLayer, setSelectedLayer, addText, canvasOptions } = editorContext;

  return (
    <div className="flex flex-col gap-4 mt-8">
      <div className="">
        <h3 className="text-[20px] font-medium">Layers</h3>
        <p className="text-[14px] text-gray-600 mt-1">Select a layer to edit</p>
      </div>

      <div
        onClick={() => { setSelectedLayer("text"); addText(); }}
        className={`flex items-center gap-2 p-2 rounded-2xl cursor-pointer font-light text-[14px]
            hover:bg-[#f0f0f0] ${selectedLayer === "text" ? "bg-[#f0f0f0]" : ""}`}
      >
        <div className="size-12 rounded-lg overflow-hidden">
          <ImageKitWrapper
            src="/general/text.png"
            alt="Text Image"
            width={48}
            height={48}
            imgWidth={48}
          />
        </div>
        <span>Add Text</span>
      </div>

      <div
        onClick={() => setSelectedLayer("canvas")}
        className={`flex items-center gap-2 p-2 rounded-2xl cursor-pointer font-light text-[14px]
            hover:bg-[#f0f0f0] ${selectedLayer === "canvas" ? "bg-[#f0f0f0]" : ""}`}
      >
        <div className="size-12 rounded-lg overflow-hidden" style={{ backgroundColor: canvasOptions.backgroundColor }}>
        </div>
        <span>Canvas</span>
      </div>
    </div>
  )
}

export default Layers
