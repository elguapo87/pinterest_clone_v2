import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const pins = await prisma.pin.findMany({
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
            take: 20
        });

        return NextResponse.json({ success: true, pins }, { status: 200 });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
    }
}