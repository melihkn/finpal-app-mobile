import { authRepo } from "@/api/authApi";
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
  username: z.string().min(2, "Min 2 characters"),
  confirm: z.string().min(6),
}).refine(d => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

type FormData = z.infer<typeof Schema>;

export default function Register() {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(Schema) });
  const router = useRouter();
  const login = useAuth(s => s.login);

  const onSubmit = async (data: FormData) => {
    try {
      const { token, user } = await authRepo.register(data.email, data.password, data.username);
      await SecureStore.setItemAsync("token", token);
      login(token, user);
      router.replace("/tabs");
    } catch (e: any) {
      Alert.alert("Register failed", e?.response?.data?.message ?? "Try again");
    }
  };

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Register</Text>

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

      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        onChangeText={(t) => setValue("confirm", t)}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      {errors.confirm && <Text style={{ color: "red" }}>{errors.confirm.message}</Text>}

      <Button title={isSubmitting ? "Creating..." : "Register"} onPress={handleSubmit(onSubmit)} />
      <Link href="/auth/login">Back to login</Link>
    </View>
  );
}
