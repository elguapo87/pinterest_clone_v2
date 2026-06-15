import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const pin = await prisma.pin.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        avatar: true
                    }
                },
                board: true
            }
        });

        if (!pin) {
            if (!pin) {
                return NextResponse.json({ success: false, message: "Pin not found" }, { status: 404 });
            }
        }

        return NextResponse.json({ success: true, pin }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
}