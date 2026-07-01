import { optionalUserAuth } from "@/lib/optionalUserAuth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await optionalUserAuth();

        let unreadCount;

        if (user) {
            unreadCount = await prisma.message.count({
                where: {
                    receiverId: user.id,
                    isRead: false
                }
            });
        }

        return NextResponse.json({ success: true, unreadCount }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch unread count" }, { status: 500 });
    }
}