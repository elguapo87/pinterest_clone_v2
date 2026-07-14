import { optionalUserAuth } from "@/lib/optionalUserAuth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type MessageWithUsers = {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
    sender: {
        id: string;
        username: string;
        avatar: string | null;
        displayName: string;
    };
    receiver: {
        id: string;
        username: string;
        avatar: string | null;
        displayName: string;
    };
};

export async function GET() {
    try {
        const user = await optionalUserAuth();

        let messages: MessageWithUsers[] = [];

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
                    msg.senderId === user?.id
                        ? msg.receiver
                        : msg.sender;

                if (!conversations.has(otherUser.id)) {
                    conversations.set(otherUser.id, {
                        user: otherUser,
                        lastMessage: msg.content,
                        lastMessageAt: msg.createdAt,
                        unreadCount: 0
                    });
                }

                const conversation = conversations.get(otherUser.id);

                if (msg.senderId === otherUser.id && msg.receiverId === user?.id && !msg.isRead) {
                    conversation.unreadCount += 1;
                }
            });
        }

        return NextResponse.json({ success: true, conversations: Array.from(conversations.values()) }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failded to fetch messages" }, { status: 500 });
    }
}