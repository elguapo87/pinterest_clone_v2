import { optionalUserAuth } from "@/lib/optionalUserAuth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await optionalUserAuth();

        const { searchParams } = new URL(req.url);
        const pinId = searchParams.get("pinId");

        if (!pinId) {
            return NextResponse.json({ success: false, message: "pinId is required" }, { status: 400 });
        }

        let liked = false;
        let saved = false;

        if (user) {
            const [existingLike, existingSave] = await Promise.all([
                prisma.like.findUnique({
                    where: {
                        userId_pinId: {
                            userId: user.id,
                            pinId
                        }
                    }
                }),

                prisma.save.findUnique({
                    where: {
                        userId_pinId: {
                            userId: user.id,
                            pinId
                        }
                    }
                })
            ]);

            liked = !!existingLike;
            saved = !!existingSave
        }

        const [likesCount, savesCount] = await Promise.all([
            prisma.like.count({
                where: {
                    pinId
                }
            }),

            prisma.save.count({
                where: {
                    pinId
                }
            })
        ]);

        return NextResponse.json({ success: true, liked, saved, likesCount, savesCount }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to check interactions" }, { status: 500 });
    }
}

