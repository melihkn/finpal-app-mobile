// app/(app)/tabs/credit-cards/_layout.tsx
import { Stack } from "expo-router";

export default function CreditCardsStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Credit Cards" }} />
      <Stack.Screen name="[id]" options={{ title: "Card Details" }} />
    </Stack>
  );
}