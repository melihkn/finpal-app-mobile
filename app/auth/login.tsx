import { authRepo } from "@/src/api/authApi";
import { useAuth } from "@/state/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Alert, View } from "react-native";
import { z } from "zod";

// 👇 Material components
import {
    Button,
    Card,
    Divider,
    HelperText,
    Text,
    TextInput,
    TouchableRipple,
} from "react-native-paper";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Min 6 characters"),
});
type FormData = z.infer<typeof Schema>;

export default function Login() {
  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(Schema) });

  const router = useRouter();
  const login = useAuth((s) => s.login);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Attempting login with", data);
      const { token, user } = await authRepo.login(data.email, data.password);
      console.log("Login successful");
      login(token, user);
      router.replace("/tabs"); // go to tabs home
    } catch (e: any) {
      console.log("Login failed", e);
      Alert.alert("Login failed", e?.response?.data?.message ?? "Try again");
    }
  };

  // For show/hide password toggle
  const [secure, setSecure] = React.useState(true);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Card mode="elevated" style={{ borderRadius: 16 }}>
        <Card.Content style={{ gap: 12 }}>
          <Text variant="headlineSmall" style={{ fontWeight: "700" }}>
            Welcome back
          </Text>
          <Text variant="bodyMedium" style={{ opacity: 0.7, marginBottom: 8 }}>
            Sign in to continue
          </Text>

          <TextInput
            label="Email"
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(t) => setValue("email", t, { shouldValidate: true })}
            left={<TextInput.Icon icon="email" />}
          />
          <HelperText type="error" visible={!!errors.email}>
            {errors.email?.message}
          </HelperText>

          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry={secure}
            onChangeText={(t) =>
              setValue("password", t, { shouldValidate: true })
            }
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={secure ? "eye-off" : "eye"}
                onPress={() => setSecure((v) => !v)}
              />
            }
          />
          <HelperText type="error" visible={!!errors.password}>
            {errors.password?.message}
          </HelperText>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={{ marginTop: 8, borderRadius: 12 }}
            contentStyle={{ paddingVertical: 6 }}
          >
            {isSubmitting ? "Signing in…" : "Login"}
          </Button>

          <Divider style={{ marginVertical: 12 }} />

          <Link href="/auth/register" asChild>
            <TouchableRipple>
              <Text
                variant="bodyLarge"
                style={{ textAlign: "center", marginTop: 4 }}
              >
                Create an account
              </Text>
            </TouchableRipple>
          </Link>
        </Card.Content>
      </Card>
    </View>
  );
}
