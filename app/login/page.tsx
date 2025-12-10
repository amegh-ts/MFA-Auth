"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoginSchema, type LoginFormData } from "@/lib/schemas/auth"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const { login: loginUser, isLogging, loginError } = useAuth()
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setGeneralError(null)
    try {
      await loginUser(data, {
        onSuccess: () => {
          router.push("/dashboard")
        },
      })
    } catch (error: any) {
      setGeneralError(error?.response?.data?.error || "Login failed")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input {...register("email")} placeholder="your@email.com" type="email" disabled={isLogging} />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input {...register("password")} placeholder="••••••••" type="password" disabled={isLogging} />
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
          </div>

          {generalError && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{generalError}</div>
          )}

          <Button type="submit" disabled={isLogging} className="w-full">
            {isLogging ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-4">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </main>
  )
}
