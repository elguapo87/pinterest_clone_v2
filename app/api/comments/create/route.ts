import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await userAuth();

        const { description, pinId } = await req.json();

        if (!pinId) {
            return NextResponse.json({ success: false, message: "Pin id is missing" }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                description,
                pinId,
                userId: user.id
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true

                    }
                }
            }
        });

        return NextResponse.json({ success: true, comment }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to create comment" }, { status: 500 });
    }
}