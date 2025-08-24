import { authRepo } from "@/src/api/authApi";
import { useAuth } from "@/state/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useForm } from "react-hook-form";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Min 6 characters"),
});
type FormData = z.infer<typeof Schema>;

export default function Login() {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(Schema) });
  const router = useRouter();
  const login = useAuth(s => s.login);

  const onSubmit = async (data: FormData) => {
    try {
      const { token, user } = await authRepo.login(data.email, data.password);
      await SecureStore.setItemAsync("token", token);
      login(token, user);
      router.replace("/tabs"); // go to tabs home
    } catch (e: any) {
      Alert.alert("Login failed", e?.response?.data?.message ?? "Try again");
    }
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Login</Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(t) => setValue("email", t)}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      {errors.email && <Text style={{ color: "red" }}>{errors.email.message}</Text>}

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(t) => setValue("password", t)}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      {errors.password && <Text style={{ color: "red" }}>{errors.password.message}</Text>}

      <Button title={isSubmitting ? "Signing in..." : "Login"} onPress={handleSubmit(onSubmit)} />
      <Link href="/auth/register">Create an account</Link>
    </View>
  );
}
