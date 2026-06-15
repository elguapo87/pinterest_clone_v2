import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await userAuth();

        const boards = await prisma.board.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ success: true, boards }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch boards" }, { status: 500 });
    }
}