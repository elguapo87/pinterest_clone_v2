import { EditorContext } from "@/context/EditorContext";
import Image from "next/image";
import { useContext, useEffect, useRef } from "react";

type PinEditorProps = {
  url: string;
  width: number;
  height: number;
} | null;

const Workspace = ({ previewImage }: { previewImage: PinEditorProps }) => {
  if (!previewImage) return;

  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("Workspace must be within EditorContextProvider");
  const { textOptions, changeTextOptions, canvasOptions, changeCanvasOptions, setSelectedLayer } = editorContext;

  useEffect(() => {
    if (!previewImage) return;

    const canvasWidth = 375;

    const canvasHeight = (canvasWidth * previewImage.height) / previewImage.width;

    changeCanvasOptions({
      width: canvasWidth,
      height: canvasHeight,
      orientation: canvasHeight > canvasWidth ? "portrait" : "landscape"
    });
  }, [previewImage]);

  const itemRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    changeTextOptions({
      left: e.clientX - offset.current.x,
      top: e.clientY - offset.current.y
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  const handleMouseLeave = () => {
    dragging.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setSelectedLayer("text");
    dragging.current = true;
    offset.current = ({
      x: e.clientX - textOptions.left,
      y: e.clientY - textOptions.top,
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setSelectedLayer("text");

    dragging.current = true;

    const touch = e.touches[0];

    offset.current = {
      x: touch.clientX - textOptions.left,
      y: touch.clientY - textOptions.top,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;

    e.preventDefault();

    const touch = e.touches[0];

    changeTextOptions({
      left: touch.clientX - offset.current.x,
      top: touch.clientY - offset.current.y,
    });
  };

  const handleTouchEnd = () => {
    dragging.current = false;
  };

  return (
    <div className="flex items-center justify-center bg-[#e9e9e9] py-16 px-0">
      <div
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={containerRef}
        className="relative rounded-4xl overflow-hidden flex items-center justify-center w-full max-w-93.75"
        style={{
          aspectRatio: `${canvasOptions.width} / ${canvasOptions.height}`,
          backgroundColor: canvasOptions.backgroundColor
        }}
      >
        <Image
          src={previewImage?.url}
          alt="Preview Image"
          width={previewImage.width}
          height={previewImage.height}
          unoptimized
          className="w-full object-contain"
        />
        {textOptions.isVisible && (
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            ref={itemRef}
            className="absolute z-999 max-w-full border border-dashed border-red-500"
            style={{ left: textOptions.left, top: textOptions.top, touchAction: "none" }}
          >
            <input
              onChange={(e) => changeTextOptions({ text: e.target.value })}
              value={textOptions.text}
              type="text"
              className="border-none outline-none bg-transparent cursor-grab w-full"
              style={{ color: textOptions.color, fontSize: `${textOptions.fontSize}px` }}
            />
            <div
              onClick={() => changeTextOptions({ isVisible: false })}
              className="absolute -top-9 right-0 bg-white size-8 flex items-center justify-center
                p-2 rounded-full cursor-pointer"
            >
              <Image
                src="/delete.svg"
                alt="Delete Image"
                width={28}
                height={28}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Workspace



