import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const user = await userAuth();

        const { searchParams } = new URL(req.url);

        const pinId = searchParams.get("pinId");

        if (!pinId) {
            return NextResponse.json({ success: false, message: "Pin id is required" }, { status: 400 });
        }

        const pin = await prisma.pin.findUnique({
            where: {
                id: pinId
            },
            include: {
                user: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!pin) {
            return NextResponse.json({ success: false, message: "Pin not found" }, { status: 403 });
        }


        if (user.id !== pin.user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized action" }, { status: 403 });
        }

        await prisma.pin.delete({
            where: {
                id: pin.id
            }
        });

        return NextResponse.json({ success: true, message: "Pin deleted" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to delete pin" }, { status: 500 });
    }
}