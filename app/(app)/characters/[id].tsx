import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Section } from '@/components/cards';
import { Button } from '@/components/form';
import { RatingDisplay } from '@/components/rating';
import { EmptyState, ErrorState, LoadingState } from '@/components/states';
import { queryKeys } from '@/core/api/queryKeys';
import { getCharacterById } from '@/core/api/simpsonsApi';
import { listNotesByCharacter } from '@/core/db/notes';
import { useSession } from '@/core/session/SessionProvider';

export default function CharacterDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const characterId = params.id;
  const { userId } = useSession();

  if (!characterId) {
    return <ErrorState title="Personaje invalido." subtitle="Regresa y vuelve a intentarlo." />;
  }

  const characterQuery = useQuery({
    queryKey: queryKeys.character(characterId),
    queryFn: () => getCharacterById(characterId),
  });

  const notesQuery = useQuery({
    queryKey: queryKeys.notes(userId ?? '', characterId),
    queryFn: () => listNotesByCharacter(userId ?? '', characterId),
    enabled: !!userId,
  });

  if (characterQuery.isLoading) {
    return <LoadingState message="Cargando personaje..." />;
  }

  if (characterQuery.isError || !characterQuery.data) {
    return <ErrorState title="No pudimos cargar el personaje." subtitle="Intenta nuevamente." />;
  }

  const character = characterQuery.data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {character.image ? (
          <Image source={character.image} style={styles.image} contentFit="cover" transition={150} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <Text style={styles.name}>{character.name}</Text>
        {character.occupation ? <Text style={styles.caption}>{character.occupation}</Text> : null}
      </View>

      <Section title="Informacion">
        <Text style={styles.description}>
          {character.description ?? 'Sin descripcion disponible.'}
        </Text>
        {character.age ? <Text style={styles.caption}>Edad: {character.age}</Text> : null}
      </Section>

      <Section title="Notas y favoritos">
        <Link href={{ pathname: '/notes/edit', params: { characterId } }} asChild>
          <Button label="Agregar nota" />
        </Link>

        {notesQuery.isLoading ? (
          <Text style={styles.caption}>Cargando notas...</Text>
        ) : notesQuery.data && notesQuery.data.length > 0 ? (
          <View style={styles.notesList}>
            {notesQuery.data.map((note) => (
              <Link
                key={note.id}
                href={{ pathname: '/notes/edit', params: { characterId, noteId: note.id } }}
                asChild>
                <Card
                  title={note.title}
                  subtitle={note.text}
                  titleRightSlot={<RatingDisplay value={note.rating} />}
                />
              </Link>
            ))}
          </View>
        ) : (
          <EmptyState title="Sin notas aun." subtitle="Agrega tu primera nota o favorito." />
        )}
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 24,
    backgroundColor: '#f2f2f2',
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  caption: {
    color: '#666',
  },
  description: {
    color: '#333',
    lineHeight: 20,
  },
  notesList: {
    gap: 12,
  },
});
