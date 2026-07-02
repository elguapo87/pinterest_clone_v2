import { EditorContext } from "@/context/EditorContext";
import Image from "next/image";
import { useContext, useState } from "react";
import { HexColorPicker } from "react-colorful";

type PinEditorProps = {
  url: string;
  width: number;
  height: number;
} | null;

type Size = {
  height: number;
  width: number;
  name: string;
};

const portraitSizes = [
  {
    name: "1:2",
    width: 1,
    height: 2,
  },
  {
    name: "9:16",
    width: 9,
    height: 16,
  },
  {
    name: "2:3",
    width: 2,
    height: 3,
  },
  {
    name: "3:4",
    width: 3,
    height: 4,
  },
  {
    name: "4:5",
    width: 4,
    height: 5,
  },
  {
    name: "1:1",
    width: 1,
    height: 1,
  },
];

const landscapeSizes = [
  {
    name: "2:1",
    width: 2,
    height: 1,
  },
  {
    name: "16:9",
    width: 16,
    height: 9,
  },
  {
    name: "3:2",
    width: 3,
    height: 2,
  },
  {
    name: "4:3",
    width: 4,
    height: 3,
  },
  {
    name: "5:4",
    width: 5,
    height: 4,
  },
  {
    name: "1:1",
    width: 1,
    height: 1,
  },
];

const Options = ({ previewImage }: { previewImage: PinEditorProps }) => {

  if (!previewImage) return;

  const editorContext = useContext(EditorContext);
  if (!editorContext) throw new Error("Options must be within EditorContextProvider");
  const { selectedLayer, textOptions, changeTextOptions, canvasOptions, changeCanvasOptions } = editorContext;

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const CANVAS_WIDTH = 375;

  const handleSizeClick = (size: Size) => {
    const newHeight = (CANVAS_WIDTH * size.height) / size.width;

    changeCanvasOptions({
      width: CANVAS_WIDTH,
      height: newHeight,
      size: size.name
    });
  };

  const handleOriginalSize = () => {
    const originalHeight = (375 * previewImage.height) / previewImage.width;

    changeCanvasOptions({
      width: 375,
      height: originalHeight,
      size: "original",
      orientation: originalHeight > 375 ? "portrait" : "landscape"
    });
  };

  const handleOrientationClick = (orientation: "portrait" | "landscape") => {
    changeCanvasOptions({ orientation });
  };

  return (
    <div className={`mt-8 ${isPickerOpen ? "max-md:pb-45" : ""} `}>
      {selectedLayer === "text" ? (
        <div className="">
          <div className="flex flex-col gap-2 mb-4">
            <span className="font-medium">Font Size</span>
            <input
              onChange={(e) => changeTextOptions({ fontSize: Number(e.target.value) })}
              value={textOptions.fontSize}
              type="number"
              className="border border-[#e0e0e0] rounded-lg p-4"
            />
          </div>
          <div className="">
            <span>Color</span>
            <div className="relative">
              <div
                onClick={() => setIsPickerOpen(prev => !prev)}
                className="size-9 rounded-full cursor-pointer"
                style={{ backgroundColor: textOptions.color }}
              />
              {isPickerOpen && (
                <div className="absolute top-[120%] left-0">
                  <HexColorPicker
                    color={textOptions.color}
                    onChange={(color) => changeTextOptions({ color: color })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="">
            <span>Orientation</span>
            {/* orientations */}
            <div className="p-1 rounded-lg bg-[#e9e9e9] flex text-sm font-medium w-max">
              {/* orientation */}
              <div
                onClick={() => handleOrientationClick("portrait")}
                className={`p-2 rounded-lg min-w-9 flex items-center justify-center cursor-pointer
                    ${canvasOptions.orientation === "portrait" ? "bg-white" : ""}`}
              >
                <Image
                  src="/portrait.svg"
                  alt="Portrait"
                  width={18}
                  height={18}
                  className="size-4.5"
                />
              </div>
              {/* orientation */}
              <div
                onClick={() => handleOrientationClick("landscape")}
                className={`p-2 rounded-lg min-w-9 flex items-center justify-center cursor-pointer
                    ${canvasOptions.orientation === "landscape" ? "bg-white" : ""}`}
              >
                <Image
                  src="/landscape.svg"
                  alt="Landscape"
                  width={18}
                  height={18}
                  className="size-4.5"
                />
              </div>
            </div>
          </div>

          <div>
            <span>Size</span>
            {/* sizes */}
            <div className="p-1 rounded-lg bg-[#e9e9e9] flex text-sm font-medium w-max">
              {/* size */}
              <div
                onClick={handleOriginalSize}
                className={`p-2 rounded-lg min-w-9 flex items-center justify-center cursor-pointer
                    ${canvasOptions.size === "original" ? "bg-white" : ""}`}
              >
                Original
              </div>
              {canvasOptions.orientation === "portrait" ? (
                <>
                  {portraitSizes.map((size) => (
                    <div
                      onClick={() => handleSizeClick(size)}
                      key={size.name}
                      className={`p-2 rounded-lg min-w-9 flex items-center justify-center cursor-pointer 
                        ${canvasOptions.size === size.name ? "bg-white" : ""}`}
                    >
                      {size.name}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {landscapeSizes.map((size) => (
                    <div
                      onClick={() => handleSizeClick(size)}
                      key={size.name}
                      className={`p-2 rounded-lg min-w-9 flex items-center justify-center cursor-pointer 
                        ${canvasOptions.size === size.name ? "bg-white" : ""}`}
                    >
                      {size.name}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="mt-2">
            <span>Background Color</span>
            <div className="relative">
              <div
                onClick={() => setIsPickerOpen(prev => !prev)}
                className="size-9 rounded-full cursor-pointer"
                style={{ backgroundColor: canvasOptions.backgroundColor }}
              />
              {isPickerOpen && (
                <div className="absolute top-[120%] left-0">
                  <HexColorPicker
                    color={canvasOptions.backgroundColor}
                    onChange={(color) => changeCanvasOptions({ backgroundColor: color })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Options
