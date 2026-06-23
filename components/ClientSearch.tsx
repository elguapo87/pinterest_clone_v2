"use client"

import { useSearchParams } from "next/navigation"
import Gallery from "./Gallery";

const ClientSearch = () => {
    const searchParams = useSearchParams();

    const search = searchParams.get("search") || "";
    const boardId = searchParams.get("boardId") || "";

    return (
        <div>
            <Gallery search={search} boardId={boardId} />
        </div>
    )
}

export default ClientSearch
