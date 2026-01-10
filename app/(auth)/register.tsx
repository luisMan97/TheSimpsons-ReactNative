import React, { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StyleSheet, Text, View } from 'react-native';

import { Button, TextField } from '@/components/form';
import { useSession } from '@/core/session/SessionProvider';
import { registerSchema, RegisterFormValues } from '@/features/auth/validation';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useSession();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    if (values.password !== values.confirmPassword) {
      setFormError('Las contrasenas no coinciden.');
      return;
    }
    try {
      await register(values.email.trim().toLowerCase(), values.password);
      router.replace('/characters');
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_IN_USE') {
        setFormError('El email ya existe.');
        return;
      }
      setFormError('No se pudo registrar.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>
      <Text style={styles.subtitle}>Guarda tus notas favoritas por personaje.</Text>

      <View style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Email"
              placeholder="lisa@springfield.com"
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
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Confirmar password"
              placeholder="******"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
            />
          )}
        />
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        <Button label={isSubmitting ? 'Creando...' : 'Registrarme'} onPress={handleSubmit(onSubmit)} />
      </View>

      <Link href="/login" style={styles.link}>
        Ya tienes cuenta? Inicia sesion
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
