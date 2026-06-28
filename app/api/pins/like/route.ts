import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await userAuth();

        const {pinId} = await req.json();

        if (!pinId) {
            return NextResponse.json({ success: false, message: "Pin id is required" }, { status: 400 });
        }

        const existingLike = await prisma.like.findUnique({
            where: {
                userId_pinId: {
                    userId: user.id,
                    pinId
                }
            }
        });

        let liked = false;

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    userId_pinId: {
                        userId: user.id,
                        pinId
                    }
                }
            });

            liked = false;

        } else {
            await prisma.like.create({
                data: {
                    userId: user.id,
                    pinId
                }
            });

            liked = true;
        }

        const likesCount = await prisma.like.count({
            where: {
                pinId
            }
        });

        return NextResponse.json({ success: true, liked, likesCount }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to like pin" }, { status: 500 });
    }
}