import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = await userAuth();

        const { pinId } = await req.json();
        if (!pinId) {
            return NextResponse.json({ success: false, message: "Pin id is required" }, { status: 400 });
        }

        const existingSave = await prisma.save.findUnique({
            where: {
                userId_pinId: {
                    userId: user.id,
                    pinId
                }
            }
        });

        let saved = false;

        if (existingSave) {
            await prisma.save.delete({
                where: {
                    userId_pinId: {
                        userId: user.id,
                        pinId
                    }
                }
            });
            saved = false;

        } else {
            await prisma.save.create({
                data: {
                    userId: user.id,
                    pinId
                }
            });
            saved = true;
        }

        return NextResponse.json({ success: true, saved }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to save pin" }, { status: 500 });
    }
}