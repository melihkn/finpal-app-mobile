// app/(auth)/_layout.tsx
import { useAuth } from "@/state/auth.store";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const hydrated = useAuth(s => s.hydrated);
  const token = useAuth(s => s.token);

  if (!hydrated) return null;
  if (token) return <Redirect href="/zaa/tabs/transactions" />; // ok now, user is signed in

  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
    </Stack>
  );
}