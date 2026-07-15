import imageKit from "@/config/imageKit";
import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    try {
        const user = await userAuth();

        const form = await req.formData();
        const title = form.get("title") as string;
        const description = form.get("description") as string;
        const link = form.get("link") as string;
        const board = form.get("board");
        const tags = form.get("tags") as string;
        const media = form.get("media") as File | null;
        const isSensitive = form.get("isSensitive") === "true";

        const textOptions = form.get("textOptions") as string;
        const canvasOptions = form.get("canvasOptions") as string;

        const parsedTextOptions = textOptions ? JSON.parse(textOptions) : null;
        const parsedCanvasOptions = canvasOptions ? JSON.parse(canvasOptions) : null;

        let mediaUrl = "";
        let width = 0;
        let height = 0;

        if (!media) {
            return NextResponse.json({ success: false, message: "Image is required" }, { status: 400 });
        }

        const bytes = await media.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // ORIGINAL IMAGE METADATA
        const metadata = await sharp(buffer).metadata();

        const originalWidth = metadata.width || 0;
        const originalHeight = metadata.height || 0;

        const originalOrientation = originalHeight > originalWidth ? "portrait" : "landscape";

        // TARGET DIMENSIONS
        let targetWidth = originalWidth;
        let targetHeight = originalHeight;

        if (parsedCanvasOptions) {
            if (parsedCanvasOptions.size !== "original") {

                const [w, h] =
                    parsedCanvasOptions.size
                        .split(":")
                        .map(Number);

                const targetAspectRatio = w / h;

                if (
                    parsedCanvasOptions.orientation === "portrait"
                ) {
                    targetHeight = originalHeight;
                    targetWidth = Math.round(
                        targetHeight * targetAspectRatio
                    );
                } else {
                    targetWidth = originalWidth;
                    targetHeight = Math.round(
                        targetWidth / targetAspectRatio
                    );
                }

            } else {
                if (
                    parsedCanvasOptions.orientation !==
                    originalOrientation
                ) {
                    targetWidth = originalHeight;
                    targetHeight = originalWidth;
                }
            }
        }

        // TRANSFORM IMAGE
        const resizedImageBuffer = await sharp(buffer)
            .resize({
                width: targetWidth,
                height: targetHeight,
                fit: "contain",
                background: parsedCanvasOptions?.backgroundColor || "#ffffff"
            })
            .jpeg({
                quality: 85,
                mozjpeg: true
            })
            .toBuffer();

        let finalBuffer = resizedImageBuffer;

        if (
            parsedTextOptions?.isVisible &&
            parsedTextOptions?.text &&
            parsedCanvasOptions &&
            parsedCanvasOptions.width > 0 &&
            parsedCanvasOptions.height > 0
        ) {
            console.log({
                parsedTextOptions,
                parsedCanvasOptions
            });
            const escapeXml = (unsafe: string) => {
                return unsafe
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&apos;");
            };

            const canvasWidth = parsedCanvasOptions?.width || targetWidth;
            const canvasHeight = parsedCanvasOptions?.height || targetHeight;

            const scaleX = targetWidth / canvasWidth;
            const scaleY = targetHeight / canvasHeight;

            const textLeft = parsedTextOptions.left * scaleX;
            const textTop = parsedTextOptions.top * scaleY;
            const fontSize = parsedTextOptions.fontSize * scaleX;

            console.log({
                scaleX,
                scaleY,
                fontSize,
                textLeft,
                textTop
            });

            const svgText = `
                <svg width="${targetWidth}" height="${targetHeight}">
                    <style>
                        .title {
                            fill: ${parsedTextOptions.color};
                            font-size: ${fontSize}px;
                            font-weight: bold;
                            font-family: DejaVu Sans;
                        }
                    </style>

                    <text
                        x="${textLeft}"
                        y="${textTop + fontSize}"
                        class="title"
                    >
                        ${escapeXml(parsedTextOptions.text)}
                    </text>
                </svg>
            `;


            finalBuffer = await sharp(resizedImageBuffer)
                .composite([
                    {
                        input: Buffer.from(svgText),
                        top: 0,
                        left: 0,
                    }
                ])
                .jpeg({
                    quality: 80,
                    mozjpeg: true
                })
                .toBuffer();
        }

        const uploadRes = await imageKit.upload({
            file: finalBuffer,
            fileName: `pin_${user.id}_${Date.now()}_${media.name}`,
            folder: "/pinterest_clone/pins"
        })

        mediaUrl = uploadRes.url;

        width = targetWidth;
        height = targetHeight;

        let boardId: string | null = null;

        if (board) {
            const existingBoard = await prisma.board.findUnique({ where: { id: String(board) } });

            if (!existingBoard) {
                return NextResponse.json({ success: false, message: "Invalid board" }, { status: 400 });
            }

            boardId = existingBoard.id;
        }

        const parsedTags = tags ? tags.split(",").map((t) => t.trim()) : [];

        console.log({
            resizedSize: resizedImageBuffer.length,
            finalSize: finalBuffer.length
        });

        const pin = await prisma.pin.create({
            data: {
                title,
                description,
                link,
                media: mediaUrl,
                width,
                height,
                tags: parsedTags,
                userId: user.id,
                boardId,
                textOptions: parsedTextOptions,
                canvasOptions: parsedCanvasOptions,
                isSensitive
            }
        });

        return NextResponse.json({ success: true, message: "Pin added", pin }, { status: 201 });

    } catch (error) {
        console.error("Create pin error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create pin"
            },
            { status: 500 }
        );
    }
}