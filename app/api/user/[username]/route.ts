import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
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

        if (!profile) {
            return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
        }

        // OPTIONAL AUTH
        let isFollowing = false;

        try {
            const authUser = await userAuth();

            if (authUser.id !== profile.id) {
                 const follow = await prisma.follow.findUnique({
                    where: {
                        followerId_followingId: {
                            followerId: authUser.id,
                            followingId: profile.id
                        }
                    }
                });
                isFollowing = !!follow;
            }

        } catch (error) {
            // user not logged in
            isFollowing = false;
        }

        return NextResponse.json({ success: true, profile, isFollowing }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}