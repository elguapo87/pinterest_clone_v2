import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";


type jwtPayload = {
    id: string;
};

export const userAuth = async () => {
    const token = (await cookies()).get("token")?.value
    if (!token) {
        throw new Error("Unauthorized");
    }

    let decoded: jwtPayload;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwtPayload;


    } catch (error) {
        throw new Error("Invalid token");
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            avatar: true,
            createdAt: true
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return user;
 };