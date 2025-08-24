import { Link } from "expo-router";
import { Button, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Link href="/auth/login" asChild>
        <Button title="Go to Login" />
      </Link>

      <Link href="/tabs/transactions" asChild>
        <Button title="Go to Transactions" />
      </Link>
    </View>
  );
}