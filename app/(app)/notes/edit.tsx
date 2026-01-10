import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button, TextField } from '@/components/form';
import { RatingInput } from '@/components/rating';
import { LoadingState } from '@/components/states';
import { queryKeys } from '@/core/api/queryKeys';
import { deleteNote, getNoteById, saveNote } from '@/core/db/notes';
import { useSession } from '@/core/session/SessionProvider';
import { noteSchema, NoteFormValues } from '@/features/notes/validation';

export default function NoteEditScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ characterId: string; noteId?: string }>();
  const { userId } = useSession();
  const [formError, setFormError] = useState<string | null>(null);
  const characterId = params.characterId;

  if (!characterId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nota invalida</Text>
      </View>
    );
  }

  const noteQuery = useQuery({
    queryKey: queryKeys.note(userId ?? '', params.noteId ?? ''),
    queryFn: () => getNoteById(params.noteId ?? '', userId ?? ''),
    enabled: !!params.noteId && !!userId,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      text: '',
      rating: 0,
    },
  });

  useEffect(() => {
    if (noteQuery.data) {
      reset({
        title: noteQuery.data.title,
        text: noteQuery.data.text,
        rating: noteQuery.data.rating,
      });
    }
  }, [noteQuery.data, reset]);

  if (params.noteId && noteQuery.isLoading) {
    return <LoadingState message="Cargando nota..." />;
  }

  const onSubmit = async (values: NoteFormValues) => {
    if (!userId) {
      return;
    }
    setFormError(null);
    try {
      await saveNote({
        id: params.noteId,
        userId,
        characterId,
        title: values.title,
        text: values.text,
        rating: values.rating,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.notes(userId, characterId),
      });
      if (params.noteId) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.note(userId, params.noteId),
        });
      }
      router.back();
    } catch {
      setFormError('No se pudo guardar la nota.');
    }
  };

  const onDelete = async () => {
    if (!userId || !params.noteId) {
      return;
    }
    Alert.alert('Eliminar nota', 'Seguro que quieres eliminar esta nota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(params.noteId ?? '', userId);
          await queryClient.invalidateQueries({
            queryKey: queryKeys.notes(userId, characterId),
          });
          await queryClient.invalidateQueries({
            queryKey: queryKeys.note(userId, params.noteId),
          });
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{params.noteId ? 'Editar nota' : 'Nueva nota'}</Text>
      <View style={styles.form}>
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Titulo"
              placeholder="Mi personaje favorito"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="text"
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Nota"
              placeholder="Escribe tu comentario"
              value={value}
              onChangeText={onChange}
              error={errors.text?.message}
              multiline
              numberOfLines={4}
            />
          )}
        />
        <Controller
          control={control}
          name="rating"
          render={({ field: { value, onChange } }) => (
            <View style={styles.ratingBlock}>
              <Text style={styles.label}>Rating</Text>
              <RatingInput value={value} onChange={onChange} />
              {errors.rating?.message ? (
                <Text style={styles.error}>{errors.rating?.message}</Text>
              ) : null}
            </View>
          )}
        />
        {formError ? <Text style={styles.error}>{formError}</Text> : null}
        <Button
          label={isSubmitting ? 'Guardando...' : 'Guardar'}
          onPress={handleSubmit(onSubmit)}
        />
        {params.noteId ? (
          <Button label="Eliminar" variant="secondary" onPress={onDelete} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  form: {
    gap: 16,
  },
  ratingBlock: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#d33',
  },
});
