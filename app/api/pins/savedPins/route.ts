import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await userAuth();

        const savedPins = await prisma.save.findMany({
            where: {
                userId: user.id
            },
            include: {
                pin: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ success: true, savedPins }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to fetch saved pins" }, { status: 500 });
    }
}