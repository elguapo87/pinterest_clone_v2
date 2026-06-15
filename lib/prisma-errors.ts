// lib/prisma-errors.ts
import { Prisma } from "@prisma/client";

export type PrismaErrorResponse = {
    message: string;
    field?: string;
    status: number;
};

export function handlePrismaError(error: unknown): PrismaErrorResponse | null {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            /**
             * Unique constraint failed
             * e.g. email, username, etc.
             */
            case "P2002": {
                console.log("P2002 META:", error.meta);
                const target = error.meta?.target as string[] | string | undefined;

                const fields = Array.isArray(target)
                    ? target
                    : target
                        ? [target]
                        : [];

                // If Prisma tells us which field failed
                const field = fields[0];

                if (field === "email") {
                    return {
                        message: "Email is already registered",
                        field: "email",
                        status: 400,
                    };
                }

                if (field === "username") {
                    return {
                        message: "Username is already taken",
                        field: "username",
                        status: 400,
                    };
                }

                return {
                    message: "Unique constraint violation",
                    field,
                    status: 400,
                };
            }

            /**
             * Record not found
             */
            case "P2025":
                return {
                    message: "Record not found",
                    status: 404,
                };

            /**
             * Foreign key constraint failed
             */
            case "P2003":
                return {
                    message: "Related record does not exist",
                    status: 400,
                };

            default:
                return {
                    message: "Database error",
                    status: 500,
                };
        }
    }

    return null;
}