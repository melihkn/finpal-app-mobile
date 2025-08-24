// app/(auth)/_layout.tsx
import { useAuth } from "@/state/auth.store";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const token = useAuth(s => s.token);
  if (token) return <Redirect href="../(app)/tabs" />;
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
    </Stack>
  );
}