import { prisma } from "@/lib/prisma";
import genToken from "@/utils/getToken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Compare passwors 
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        const token = genToken(user.id);

        const cookieStore = await cookies();

        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/"
        });

        return NextResponse.json({
            success: true,
            message: "Logged in successful",
            user: {
                id: user.id,
                displayName: user.displayName,
                username: user.username,
                avatar: user.avatar,
                email: user.email
            }
        }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}