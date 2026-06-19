import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");

        const pins = await prisma.pin.findMany({
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor }
            }),
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                board: true
            },
            take: 21
        });

        return NextResponse.json({ success: true, pins }, { status: 200 });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
    }
}