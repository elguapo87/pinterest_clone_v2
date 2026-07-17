type RenderPinParams = {
    image: {
        url: string;
        width: number;
        height: number;
    };

    textOptions: {
        text: string;
        fontSize: number;
        color: string;
        top: number;
        left: number;
        isVisible: boolean;
    };

    canvasOptions: {
        width: number;
        height: number;
        backgroundColor: string;
        size: string;
        orientation: "portrait" | "landscape";
    };
};


export async function renderPin({
    image,
    textOptions,
    canvasOptions,
}: RenderPinParams): Promise<File> {

    const canvas = document.createElement("canvas");

    const editorRatio = canvasOptions.width / canvasOptions.height;

    let exportWidth: number;
    let exportHeight: number;

    if (editorRatio >= 1) {
        exportWidth = image.width;
        exportHeight = Math.round(
            exportWidth / editorRatio
        );
    } else {
        exportHeight = image.height;
        exportWidth = Math.round(
            exportHeight * editorRatio
        );
    }

    canvas.width = exportWidth;
    canvas.height = exportHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Canvas context unavailable");
    }

    // Background
    ctx.fillStyle = canvasOptions.backgroundColor;
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Load image
    const img = new Image();

    img.crossOrigin = "anonymous";

    await new Promise<void>((resolve, reject) => {

        img.onload = () => resolve();

        img.onerror = () => {
            reject(new Error("Failed to load image"));
        };

        img.src = image.url;
    });

    const imageRatio = image.width / image.height;

    const canvasRatio = canvas.width / canvas.height;

    let drawWidth;
    let drawHeight;
    let drawX;
    let drawY;

    if (imageRatio > canvasRatio) {

        // image is wider

        drawWidth = canvas.width;

        drawHeight = drawWidth / imageRatio;

        drawX = 0;

        drawY = (canvas.height - drawHeight) / 2;

    } else {

        // image is taller

        drawHeight = canvas.height;

        drawWidth = drawHeight * imageRatio;

        drawY = 0;

        drawX = (canvas.width - drawWidth) / 2;
    }

    ctx.drawImage(
        img,
        drawX,
        drawY,
        drawWidth,
        drawHeight
    );

    // Draw text
    if (
        textOptions.isVisible &&
        textOptions.text
    ) {

        const scaleX = canvas.width / canvasOptions.width;
        const scaleY = canvas.height / canvasOptions.height;

        const textX = textOptions.left * scaleX;
        const textY = textOptions.top * scaleY;

        const fontSize = textOptions.fontSize * scaleX;

        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillStyle = textOptions.color;
        ctx.textBaseline = "top";
        ctx.textAlign = "left";

        ctx.fillText(
            textOptions.text,
            textX,
            textY
        );
    }

    // Convert canvas -> File

    const blob = await new Promise<Blob | null>((resolve) => {

        canvas.toBlob(
            (blob) => resolve(blob),
            "image/jpeg",
            0.9
        );

    });


    if (!blob) {
        throw new Error("Failed to create image");
    }


    return new File(
        [blob],
        "rendered-pin.jpg",
        {
            type: "image/jpeg"
        }
    );
}