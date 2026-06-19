"use client"

import { createContext, useState } from "react";

type TextOptions = {
    text: string;
    fontSize: number;
    color: string;
    top: number;
    left: number;
    isVisible: boolean;
};

type CanvasOptions = {
    width: number;
    height: number;
    orientation: "portrait" | "landscape";
    size: string;
    backgroundColor: string;
};

interface EditorContextType {
    selectedLayer: string;
    setSelectedLayer: React.Dispatch<React.SetStateAction<string>>;
    textOptions: TextOptions;
    setTextOptions: React.Dispatch<React.SetStateAction<TextOptions>>;
    canvasOptions: CanvasOptions;
    setCanvasOptions: React.Dispatch<React.SetStateAction<CanvasOptions>>;
    changeTextOptions: (newOption: Partial<TextOptions>) => void;
    addText: () => void;
    changeCanvasOptions: (newOption: Partial<CanvasOptions>) => void;
};

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

const EditorContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [selectedLayer, setSelectedLayer] = useState<string>("canvas");

    const [textOptions, setTextOptions] = useState<TextOptions>({
        text: "",
        fontSize: 48,
        color: "#000000",
        top: 48,
        left: 0,
        isVisible: false
    });

    const [canvasOptions, setCanvasOptions] = useState<CanvasOptions>({
        width: 375,
        height: 0,
        orientation: "portrait",
        size: "original",
        backgroundColor: "#008080"
    });

    const changeTextOptions = (newOption: Partial<TextOptions>) => {
        setTextOptions((prev) => ({
            ...prev,
            ...newOption
        }));
    };

    const addText = () => {
        setTextOptions({
            text: "Add Text",
            fontSize: 48,
            color: "#000000",
            top: 48,
            left: 0,
            isVisible: true
        });
    };

    const changeCanvasOptions = (newOption: Partial<CanvasOptions>) => {
        setCanvasOptions((prev) => ({
            ...prev,
            ...newOption
        }));
    };

    const value = {
        selectedLayer, setSelectedLayer,
        textOptions, setTextOptions,
        canvasOptions, setCanvasOptions,
        changeTextOptions,
        addText,
        changeCanvasOptions
    };

    return (
        <EditorContext.Provider value={value}>
            {children}
        </EditorContext.Provider>
    )
};

export default EditorContextProvider;
