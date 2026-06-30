import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await userAuth();

        let messages;

        if (user) {
            messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: user.id },
                        { receiverId: user.id }
                    ]
                },
                include: {
                    receiver: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatar: true
                        }
                    },
                    sender: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatar: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }

        let conversations = new Map();

        if (messages) {
            messages.forEach((msg) => {
                const otherUser =
                    msg.senderId === user.id
                        ? msg.receiver
                        : msg.sender;

                if (!conversations.has(otherUser.id)) {
                    conversations.set(otherUser.id, {
                        user: otherUser,
                        lastMessage: msg.content,
                        lastMessageAt: msg.createdAt
                    });
                }
            });
        }

        return NextResponse.json({ success: true, conversations: Array.from(conversations.values()) }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failded to fetch messages" }, { status: 500 });
    }
}