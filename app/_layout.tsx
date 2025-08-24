// app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../src/state/auth.store";

const qc = new QueryClient();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const hydrated = useAuth(s => s.hydrated);
  const hydrate = useAuth(s => s.hydrate);

  useEffect(() => { hydrate(); }, []);
  useEffect(() => { if (hydrated) SplashScreen.hideAsync(); }, [hydrated]);

  if (!hydrated) return null; // keep splash visible

  return (
    <QueryClientProvider client={qc}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(app)" />
      </Stack>
    </QueryClientProvider>
  );
}
