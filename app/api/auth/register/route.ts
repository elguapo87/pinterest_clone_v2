import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import genToken from "@/utils/getToken";
import { cookies } from "next/headers";
import { handlePrismaError } from "@/lib/prisma-errors";

export async function POST(req: NextRequest) {
    try {
        const { displayName, username, email, password } = await req.json();

        if (!displayName || !username || !email || !password) {
            return NextResponse.json({ success: false, message: "Missing details" }, { status: 400 });
        }

        // Check if user already exists 
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json({ success: false, message: "Email is already registered", }, { status: 400 });
            }

            if (existingUser.username === username) {
                return NextResponse.json({ success: false, message: "Username is already taken", }, { status: 400 });
            }
        }

        // Validate password length
        if (password.length < 8) {
            return NextResponse.json({ success: false, message: "Please enter a strong password" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in db
        const user = await prisma.user.create({
            data: {
                username,
                email,
                displayName,
                password: hashedPassword
            }
        });

        const token = genToken(user.id);

        const cookieStore = await cookies();

        cookieStore.set("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60,
            path: "/"
        });

        return NextResponse.json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user.id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }
        }, { status: 201 });

    } catch (error) {
        const prismaError = handlePrismaError(error);

        if (prismaError) {
            return NextResponse.json(
                {
                    success: false,
                    message: prismaError.message,
                    field: prismaError.field,
                },
                { status: prismaError.status }
            );
        }

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}