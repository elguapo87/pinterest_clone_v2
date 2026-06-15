import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await userAuth();

        const { title } = await req.json();

        if (!title.trim()) {
            return NextResponse.json({ success: false, message: "Board title is require" }, { status: 400 });
        }

        const board = await prisma.board.create({
            data: {
                title,
                userId: user.id
            }
        });

        return NextResponse.json({ success: true, board }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to create board" }, { status: 500 });
    }
}