import ClientSearch from "@/components/ClientSearch"
import { Suspense } from "react"

const Search = () => {
  return (
    <Suspense fallback={null}>
      <ClientSearch />
    </Suspense>
  )
}

export default Search
