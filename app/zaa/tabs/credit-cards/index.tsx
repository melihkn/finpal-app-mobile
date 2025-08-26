// app/(app)/tabs/credit-cards/index.tsx
import { fetchCreditCards } from "@/src/api/creditCardApi";
import CreditCardItem from "@/src/components/CreditCardItem";
import type { CreditCard } from "@/src/types/cardTypes";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function CreditCardsScreen() {
  const router = useRouter();
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchCreditCards();
      setCards(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 32 }} />;
  }

  return (
    <FlatList
      data={cards}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CreditCardItem
          card={item}
          onPress={() =>
            router.push({ pathname: "/tabs/credit-cards/[id]", params: { id: item.id } })
          }
        />
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 32 }}>No cards</Text>}
    />
  );
}