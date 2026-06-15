import { userAuth } from "@/lib/userAuth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await userAuth();

        return NextResponse.json({ success: true, user }, { status: 200 });

    } catch (error) {
        // GUEST USER
        if (
            error instanceof Error &&
            (
                error.message === "Unauthorized" ||
                error.message === "Invalid token" ||
                error.message === "User not found"
            )
        ) {
            return NextResponse.json({ success: true, user: null }, { status: 200 });
        }

        return NextResponse.json({ success: false, message: "Failed to fetch user" }, { status: 500 });
    }
}