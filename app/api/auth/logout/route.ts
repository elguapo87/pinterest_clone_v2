import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    (await cookies()).set("token", "", {
        expires: new Date(0),
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        httpOnly: true
    });

    return NextResponse.json({ success: true, message: "Logged out successfully" }, { status: 200 });
}