import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const user = await userAuth();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "Comment id is missing" }, { status: 400 });
        }

        const comment = await prisma.comment.findUnique({
            where: {
                id
            }
        });

        if (user.id !== comment?.userId) {
            return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 403 });
        }

        await prisma.comment.delete({
            where: {
                id
            }
        });

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to delete comment" }, { status: 500 });
    }
}