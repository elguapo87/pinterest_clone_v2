import imageKit from "@/config/imageKit";
import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const user = await userAuth();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id") as string;

        const form = await req.formData();
        const title = form.get("title") as string;
        const description = form.get("description") as string;
        const link = form.get("link") as string;
        const tags = form.get("tags") as string;
        const board = form.get("board");
        const media = form.get("media") as File | null;
        const isSensitive = form.get("isSensitive") === "true";

        let boardId: string | null = null;

        if (board) {
            const existingBoard = await prisma.board.findUnique({
                where: {
                    id: String(board)
                }
            });

            if (!existingBoard) {
                return NextResponse.json({ success: false, message: "Invalid board" }, { status: 400 });
            }

            boardId = existingBoard.id
        }

        const parsedTags = tags ? tags.split(",").map((t) => t.trim()) : [];

        const updateData: {
            title: string;
            description: string;
            link: string;
            tags: string[];
            boardId: string | null;
            media?: string;
            isSensitive: boolean;
        } = {
            title,
            description,
            link,
            tags: parsedTags,
            boardId,
            isSensitive
        };

        if (media) {
            const bytes = await media.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadRes = await imageKit.upload({
                file: buffer,
                fileName: `pin_${user.id}_${Date.now()}_${media.name}`,
                folder: "/pinterest_clone/profile"
            });

            updateData.media = uploadRes.url;
        }

        const pin = await prisma.pin.findUnique({
            where: {
                id
            }
        });

        if (!pin) {
            return NextResponse.json({ success: false, message: "Pin not found" }, { status: 404 });
        }

        if (pin.userId !== user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
        }

        await prisma.pin.update({
            where: {
                id
            },
            data: updateData
        })

        return NextResponse.json({ success: true, message: "Pin updated" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to update pin" }, { status: 500 });
    }
}




