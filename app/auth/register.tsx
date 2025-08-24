import { authRepo } from "@/api/authApi";
import { useAuth } from "@/state/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { z } from "zod";

import {
  Button,
  Card,
  Divider,
  HelperText,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";

const Schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, "Min 6 characters"),
    confirm: z.string().min(6),
    firstname: z.string().min(2, "Min 2 characters"),
    lastname: z.string().min(2, "Min 2 characters"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormData = z.infer<typeof Schema>;

export default function Register() {
  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(Schema) });

  const router = useRouter();
  const login = useAuth((s) => s.login);

  const [secure, setSecure] = React.useState(true);
  const [secureConfirm, setSecureConfirm] = React.useState(true);

  const onSubmit = async (data: FormData) => {
    try {
      const { token, user } = await authRepo.register(
        data.email,
        data.password,
        data.firstname,
        data.lastname
      );
      await SecureStore.setItemAsync("token", token);
      await login(token, user);
      router.replace("/tabs");
    } catch (e: any) {
      Alert.alert("Register failed", e?.response?.data?.message ?? "Try again");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 16,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Card mode="elevated" style={{ borderRadius: 16 }}>
          <Card.Content style={{ gap: 12 }}>
            <Text variant="headlineSmall" style={{ fontWeight: "700" }}>
              Create your account
            </Text>
            <Text variant="bodyMedium" style={{ opacity: 0.7, marginBottom: 8 }}>
              Join FinPal in seconds
            </Text>

            <TextInput
              label="First name"
              mode="outlined"
              onChangeText={(t) => setValue("firstname", t, { shouldValidate: true })}
              left={<TextInput.Icon icon="account" />}
            />
            <HelperText type="error" visible={!!errors.firstname}>
              {errors.firstname?.message}
            </HelperText>

            <TextInput
              label="Last name"
              mode="outlined"
              onChangeText={(t) => setValue("lastname", t, { shouldValidate: true })}
              left={<TextInput.Icon icon="account" />}
            />
            <HelperText type="error" visible={!!errors.lastname}>
              {errors.lastname?.message}
            </HelperText>

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
              onChangeText={(t) => setValue("password", t, { shouldValidate: true })}
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

            <TextInput
              label="Confirm password"
              mode="outlined"
              secureTextEntry={secureConfirm}
              onChangeText={(t) => setValue("confirm", t, { shouldValidate: true })}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={secureConfirm ? "eye-off" : "eye"}
                  onPress={() => setSecureConfirm((v) => !v)}
                />
              }
            />
            <HelperText type="error" visible={!!errors.confirm}>
              {errors.confirm?.message}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={{ marginTop: 8, borderRadius: 12 }}
              contentStyle={{ paddingVertical: 6 }}
            >
              {isSubmitting ? "Creating…" : "Register"}
            </Button>

            <Divider style={{ marginVertical: 12 }} />

            <Link href="/auth/login" asChild>
              <TouchableRipple>
                <Text
                  variant="bodyLarge"
                  style={{ textAlign: "center", marginTop: 4 }}
                >
                  Back to login
                </Text>
              </TouchableRipple>
            </Link>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
