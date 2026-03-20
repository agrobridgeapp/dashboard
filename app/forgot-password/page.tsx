import { Header } from "@/components/header"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24 min-h-[calc(100vh-64px)] flex items-center justify-center">
        <ForgotPasswordForm />
      </main>
    </div>
  )
}
