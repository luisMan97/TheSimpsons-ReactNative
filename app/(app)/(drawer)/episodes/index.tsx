import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/cards';
import { EmptyState, ErrorState, LoadingState } from '@/components/states';
import { queryKeys } from '@/core/api/queryKeys';
import { getEpisodes } from '@/core/api/simpsonsApi';

const PAGE_START = 1;

export default function EpisodesScreen() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.episodes(),
    initialPageParam: PAGE_START,
    queryFn: ({ pageParam }) => getEpisodes({ page: pageParam }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });

  const episodes = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) {
    return <LoadingState message="Cargando episodios..." />;
  }

  if (isError) {
    return <ErrorState title="No pudimos cargar los episodios." subtitle="Intenta nuevamente." />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={episodes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/episodes/${item.id}`} asChild>
            <Card title={item.name} subtitle={item.season ? `Season ${item.season}` : ''} image={item.image} />
          </Link>
        )}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingNextPage ? <Text style={styles.footer}>Cargando mas...</Text> : null
        }
        ListEmptyComponent={<EmptyState title="Sin episodios" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f2e9',
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  footer: {
    textAlign: 'center',
    color: '#666',
  },
});
