import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Welcome</h1>
          <p className="mt-2 text-muted-foreground">
            Authentication System Demo
          </p>
        </div>
        <div className="space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full">Login</Button>
          </Link>
          <Link href="/register" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              Register
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
