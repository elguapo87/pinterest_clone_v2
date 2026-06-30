import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await userAuth();

        const { content, receiverId } = await req.json();

        if (!content.trim()) {
            return NextResponse.json({ success: false, message: "Message content is required" }, { status: 400 });
        }

        if (!receiverId) {
            return NextResponse.json({ success: false, message: "Receiver is required" }, { status: 400 });
        }

        if (receiverId === user.id) {
            return NextResponse.json({ success: false, message: "You cannot message yourself" }, { status: 400 });
        }

        const receiver = await prisma.user.findUnique({
            where: {
                id: receiverId
            }
        });

        if (!receiver) {
            return NextResponse.json({ success: false, message: "Receiver not found" }, { status: 404 });
        }

        const message = await prisma.message.create({
            data: {
                senderId: user.id,
                receiverId,
                content: content.trim()
            }
        });

        return NextResponse.json({ success: true, message }, { status: 201 });

    } catch (error) {
        console.error(error);

        return NextResponse.json({ success: false, message: "Failded to send message" }, { status: 500 });
    }
}
