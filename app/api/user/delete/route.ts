import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE() {
    try {
        const user = await userAuth();

        await prisma.user.delete({
            where: {
                id: user.id
            }
        });

        return NextResponse.json({ success: true, message: "Account deleted" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to delete account" }, { status: 500 });
    }
}