"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

export default function BotAccessPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Bot Access</h1>
        </div>

        <Card className="p-8 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Connected Bots</h2>
            <p className="text-muted-foreground mb-6">Manage which bots have access to your account</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Bot Alpha</p>
                  <p className="text-sm text-muted-foreground">Connected on Dec 1, 2024</p>
                </div>
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Bot Beta</p>
                  <p className="text-sm text-muted-foreground">Connected on Dec 5, 2024</p>
                </div>
                <Button variant="outline" size="sm">
                  Revoke
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">API Keys</h3>
            <p className="text-muted-foreground mb-4">Generate API keys for bot integrations</p>
            <Button>Generate New Key</Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
