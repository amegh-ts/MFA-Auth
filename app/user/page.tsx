"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

export default function UserPage() {
  const router = useRouter()
  const { user, isLoadingUser } = useAuth()

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

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline">← Back</Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
        </div>

        <Card className="p-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Account Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground text-lg mt-1">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground text-lg mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-foreground text-lg mt-1">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Video</h3>
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Video Placeholder</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
