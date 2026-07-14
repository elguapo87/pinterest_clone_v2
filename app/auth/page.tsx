import AuthWrapper from "@/components/auth/AuthWrapper"
import { Suspense } from "react"

const Auth = () => {
  return (
    <Suspense fallback={null}>
      <AuthWrapper />
    </Suspense>
  )
}

export default Auth
