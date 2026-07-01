import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await userAuth();

        const { searchParams } = new URL(req.url);
        const receiverId = searchParams.get("receiverId");

        if (!receiverId) {
            return NextResponse.json({ success: false, message: "Receiver is requred" }, { status: 400 });
        }

        const receiver = await prisma.user.findUnique({
            where: {
                id: receiverId
            },
            select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true
            }
        });

        await prisma.message.updateMany({
            where: {
                senderId: receiverId!,
                receiverId: user.id,
                isRead: false
            },
            data: {
                isRead: true
            }
        });

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: user.id, receiverId },
                    { senderId: receiverId, receiverId: user.id }
                ]
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return NextResponse.json({ success: true, messages, receiver }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failded to fetch messages" }, { status: 500 });
    }
}