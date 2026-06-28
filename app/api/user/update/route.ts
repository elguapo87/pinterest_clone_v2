import imageKit from "@/config/imageKit";
import { prisma } from "@/lib/prisma";
import { userAuth } from "@/lib/userAuth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const user = await userAuth();

        const form = await req.formData();
        const username = form.get("username") as string;
        const displayName = form.get("displayName") as string;
        const avatar = form.get("avatar") as File | null;

        let avatarUrl = "";

        if (avatar) {
            const bytes = await avatar.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadRes = await imageKit.upload({
                file: buffer,
                fileName: `avatar_${user.id}_${Date.now()}_${avatar.name}`,
                folder: "/pinterest_clone/profile"
            });

            avatarUrl = uploadRes.url;
        }

        if (username) {
            const existingUser = await prisma.user.findUnique({
                where: {
                    username,
                    NOT: {
                        id: user.id
                    }
                }
            });

            if (existingUser) {
                return NextResponse.json({ success: false, message: "Username is already exists" }, { status: 400 })
            }
        }

        const updateData: {
            username?: string;
            displayName?: string;
            avatar?: string;
        } = {};

        if (username) {
            updateData.username = username;
        }

        if (displayName) {
            updateData.displayName = displayName;
        }

        if (avatar) {
            updateData.avatar = avatarUrl
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: updateData,
            select: {
                id: true,
                displayName: true,
                username: true,
                avatar: true
            }
        });

        return NextResponse.json({ success: true, message: "Profile updated", user: updatedUser }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
    }
}