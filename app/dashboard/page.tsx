"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoadingUser, logout, isLoggingOut } = useAuth()

  if (isLoadingUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </main>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handleLogout = async () => {
    await logout(undefined, {
      onSuccess: () => {
        router.push("/")
      },
    })
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <Button variant="destructive" disabled={isLoggingOut} onClick={handleLogout}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">Welcome</h2>
            <p className="text-muted-foreground">Hello, {user?.name}!</p>
          </Card>

          <Link href="/user" className="block">
            <Card className="p-6 hover:bg-card/80 transition-colors cursor-pointer h-full">
              <h2 className="text-lg font-semibold text-foreground mb-2">User Profile</h2>
              <p className="text-muted-foreground">View your profile details</p>
            </Card>
          </Link>

          <Link href="/bot-access" className="block">
            <Card className="p-6 hover:bg-card/80 transition-colors cursor-pointer h-full">
              <h2 className="text-lg font-semibold text-foreground mb-2">Bot Access</h2>
              <p className="text-muted-foreground">Manage bot access settings</p>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
