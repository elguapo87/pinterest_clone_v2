import imageKit from "@/config/imageKit";
import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

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

        let mediaUrl = "";
        let width = 0;
        let height = 0;

        if (media) {
            const bytes = await media.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadRes = await imageKit.upload({
                file: buffer,
                fileName: `pin_${user.id}_${Date.now()}_${media.name}`,
                folder: "/pins"
            });

            mediaUrl = uploadRes.url;
            width = uploadRes.width;
            height = uploadRes.height;
        }

        if (!media) {
            return NextResponse.json({ success: false, message: "Image is required" }, { status: 400 });
        }

        let boardId: string | null = null;

        if (board) {
            const existingBoard = await prisma.board.findUnique({ where: { id: String(board) } });

            if (!existingBoard) {
                return NextResponse.json({ success: false, message: "Invalid board" }, { status: 400 });
            }

            boardId = existingBoard.id;
        }

        const parsedTags = tags ? tags.split(",").map((t) => t.trim()) : [];

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
                boardId
            }
        });

        return NextResponse.json({ success: true, pin }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to create pin" }, { status: 500 });
    }
}