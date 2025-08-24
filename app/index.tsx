// app/index.tsx
import { useAuth } from "@/state/auth.store";
import { Redirect } from "expo-router";

export default function Index() {
  // Option A: simplest
  const token = useAuth(s => s.token);
  const hydrated = useAuth(s => s.hydrated);

  if (!hydrated) return null;               // wait for SecureStore hydration
  return <Redirect href={token ? "/tabs/transactions" : "/auth/login"} />;
}