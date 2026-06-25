import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ success: false, message: "Username not found" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const followersCount = await prisma.follow.count({
            where: {
                followingId: user.id
            }
        });

        const followingsCount = await prisma.follow.count({
            where: {
                followerId: user.id
            }
        });

        return NextResponse.json({ success: true, followersCount, followingsCount }, { status: 200 });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
    }
}