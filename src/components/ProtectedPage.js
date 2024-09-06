'use client';

import { useSession } from "next-auth/react";

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Access Denied. Please sign in.</p>;
  }

  return <p>Protected Content. Welcome, {session.user.name}!</p>;
}
