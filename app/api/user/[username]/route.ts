import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ username: string }> }) {
    try {
        const { username } = await context.params;

        const profile = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                displayName: true,
                createdAt: true,
                updatedAt: true,
                pins: true,
                boards: {
                    include: {
                        pins: {
                            take: 4,
                            orderBy: {
                                createdAt: "desc"
                            },
                            select: {
                                id: true,
                                media: true,
                                width: true,
                                height: true
                            }
                        },
                        _count: {
                            select: {
                                pins: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({ success: true, profile }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}