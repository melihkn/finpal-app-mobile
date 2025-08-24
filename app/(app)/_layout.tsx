// app/(app)/_layout.tsx
import { useAuth } from "@/state/auth.store";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const token = useAuth(s => s.token);
  if (!token) return <Redirect href="../(auth)/login" />;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tabs/_layout" />
    </Stack>
  );
}