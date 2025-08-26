// app/(app)/_layout.tsx
import { useAuth } from "@/state/auth.store";
import { Redirect, Slot } from "expo-router";

export default function ProtectedLayout() {
  const hydrated = useAuth(s => s.hydrated);
  const token = useAuth(s => s.token);

  if (!hydrated) return null;
  if (!token) return <Redirect href="/auth/login" />; // ← PUBLIC route only

  return <Slot />;
}