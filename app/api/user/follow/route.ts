import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await userAuth();

        const { searchParams } = new URL(req.url);
        const username = searchParams.get("username");

        if (!username) {
            return NextResponse.json({ success: false, message: "Username not found" }, { status: 400 });
        }

        const otherUser = await prisma.user.findUnique({
            where: {
                username
            }
        });

        if (!otherUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (user.id === otherUser.id) {
            return NextResponse.json({ success: false, message: "You can't follow your self" }, { status: 400 });
        }

        const isFollowing = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: user.id,
                    followingId: otherUser.id
                }
            }
        });

        if (isFollowing) {
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: user.id,
                        followingId: otherUser.id
                    }
                }
            });

            return NextResponse.json({ success: true, isFollowing: false }, { status: 200 });
        }

        await prisma.follow.create({
            data: {
                followerId: user.id,
                followingId: otherUser.id
            }
        });

        return NextResponse.json({ success: true, isFollowing: true }, { status: 201 });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ success: false, message: errMessage }, { status: 500 });
    }
}