"use client";

import { useAuth } from "@/components/auth/access-token-provider";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function ProfilePage() {
  const { authFetch, logout } = useAuth();

  const fetchProfile = async () => {
    const res = await authFetch("/api/auth/me");
    if (!res.ok) throw new Error("Failed to load profile");
    return (await res.json()) as {
      id: string;
      email: string;
      createdAt: string;
    };
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const onLogout = async () => {
    await logout();
    // Optional: invalidate profile query
    refetch();
  };

  return (
    <main className="mx-auto max-w-lg p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-balance">Your Profile</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">Failed to load profile</p>}
      {data && (
        <div className="rounded-lg border p-4">
          <p className="text-sm">ID: {data.id}</p>
          <p className="text-sm">Email: {data.email}</p>
          <p className="text-sm">
            Joined: {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button onClick={onLogout} variant="secondary">
          Logout
        </Button>
        <Link href="/" className="underline text-sm">
          Home
        </Link>
      </div>
    </main>
  );
}
