import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

type JwtPayload = {
    id: string;
}

export const optionalUserAuth = async () => {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatar: true,
                createdAt: true
            }
        });

        return user;

    } catch (error) {
        return null;
    }
};