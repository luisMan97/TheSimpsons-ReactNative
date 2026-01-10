import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { Button, TextField } from '@/components/form';
import { useSession } from '@/core/session/SessionProvider';
import { LoginFormValues, loginSchema } from '@/features/auth/validation';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useSession();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login(values.email.trim().toLowerCase(), values.password);
      router.replace('/characters');
    } catch {
      setFormError('Credenciales invalidas.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Springfield</Text>
      <Text style={styles.subtitle}>Accede para gestionar tus notas y favoritos.</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Email"
              placeholder="homer@springfield.com"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Password"
              placeholder="******"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        <Button label={isSubmitting ? 'Entrando...' : 'Entrar'} onPress={handleSubmit(onSubmit)} />
      </View>

      <Link href="/register" style={styles.link}>
        No tienes cuenta? Registrate
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#555',
  },
  form: {
    gap: 16,
  },
  error: {
    color: '#d33',
  },
  link: {
    color: '#1c1c1c',
    fontWeight: '600',
  },
});
