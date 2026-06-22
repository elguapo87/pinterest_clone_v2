"use client"

import { useSearchParams } from "next/navigation"
import Gallery from "./Gallery";

const ClientSearch = () => {
    const searchParams = useSearchParams();

    const search = searchParams.get("search") || "";

    return (
        <div>
            <Gallery search={search} />
        </div>
    )
}

export default ClientSearch
