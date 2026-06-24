import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const pinId = searchParams.get("pinId");

        if (!pinId) {
            return NextResponse.json({ success: false, message: "Pin id is missing" }, { status: 400 });
        }

        const comments = await prisma.comment.findMany({
            where: {
                pinId
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ success: true, comments }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to get comments" }, { status: 500 });
    }
}