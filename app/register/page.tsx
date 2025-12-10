"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema, type RegisterFormData } from "@/lib/schemas/auth"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser, isRegistering, registerError } = useAuth()
  const [generalError, setGeneralError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setGeneralError(null)
    try {
      await registerUser(data, {
        onSuccess: () => {
          router.push("/dashboard")
        },
      })
    } catch (error: any) {
      setGeneralError(error?.response?.data?.error || "Registration failed")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Register</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Name</label>
            <Input {...register("name")} placeholder="Your name" type="text" disabled={isRegistering} />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input {...register("email")} placeholder="your@email.com" type="email" disabled={isRegistering} />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input {...register("password")} placeholder="••••••••" type="password" disabled={isRegistering} />
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
            <Input {...register("confirmPassword")} placeholder="••••••••" type="password" disabled={isRegistering} />
            {errors.confirmPassword && (
              <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {generalError && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">{generalError}</div>
          )}

          <Button type="submit" disabled={isRegistering} className="w-full">
            {isRegistering ? "Registering..." : "Register"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </main>
  )
}
