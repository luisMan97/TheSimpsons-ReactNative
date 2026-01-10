import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Section } from '@/components/cards';
import { ErrorState, LoadingState } from '@/components/states';
import { queryKeys } from '@/core/api/queryKeys';
import { getEpisodeById } from '@/core/api/simpsonsApi';

export default function EpisodeDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const episodeId = params.id;

  if (!episodeId) {
    return <ErrorState title="Episodio invalido." subtitle="Regresa y vuelve a intentarlo." />;
  }

  const episodeQuery = useQuery({
    queryKey: queryKeys.episode(episodeId),
    queryFn: () => getEpisodeById(episodeId),
  });

  if (episodeQuery.isLoading) {
    return <LoadingState message="Cargando episodio..." />;
  }

  if (episodeQuery.isError || !episodeQuery.data) {
    return <ErrorState title="No pudimos cargar el episodio." subtitle="Intenta nuevamente." />;
  }

  const episode = episodeQuery.data;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {episode.image ? (
          <Image source={episode.image} style={styles.image} contentFit="cover" transition={150} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <Text style={styles.title}>{episode.name}</Text>
        <Text style={styles.caption}>
          {episode.season ? `Season ${episode.season}` : 'Season N/A'}
          {episode.episodeNumber ? ` · Episode ${episode.episodeNumber}` : ''}
        </Text>
      </View>

      <Section title="Resumen">
        <Text style={styles.body}>
          {episode.synopsis ?? episode.description ?? 'Sin resumen disponible.'}
        </Text>
      </Section>

      <Section title="Detalles">
        <Text style={styles.detail}>
          Airdate: {episode.airdate ?? 'N/A'}
        </Text>
        {episode.episode ? <Text style={styles.detail}>Episode code: {episode.episode}</Text> : null}
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
    width: 200,
    height: 200,
    borderRadius: 18,
    backgroundColor: '#f2f2f2',
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  caption: {
    color: '#666',
  },
  body: {
    color: '#333',
    lineHeight: 20,
  },
  detail: {
    color: '#444',
  },
});
