import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';

import { Card } from '@/components/cards';
import { ListSkeleton } from '@/components/skeletons';
import { EmptyState, ErrorState } from '@/components/states';
import { queryKeys } from '@/core/api/queryKeys';
import { getCharacters } from '@/core/api/simpsonsApi';

const PAGE_START = 1;

export default function CharactersScreen() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(query.trim()), 400);
    return () => clearTimeout(handle);
  }, [query]);

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
    queryKey: queryKeys.characters(debounced),
    initialPageParam: PAGE_START,
    queryFn: ({ pageParam }) => getCharacters({ page: pageParam, nameQuery: debounced || undefined }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });

  const characters = data?.pages.flatMap((page) => page.items) ?? [];
  const normalizedQuery = debounced.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;
  const filteredCharacters =
    normalizedQuery.length > 0
      ? characters.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
      : characters;

  if (isLoading) {
    return <ListSkeleton />;
  }

  if (isError) {
    return <ErrorState title="No pudimos cargar los personajes." subtitle="Intenta nuevamente." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          accessibilityLabel="Buscar personaje"
          placeholder="Buscar personaje"
          style={styles.search}
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <FlatList
        contentContainerStyle={styles.list}
        data={filteredCharacters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/characters/${item.id}`} asChild>
            <Card title={item.name} subtitle={item.occupation ?? 'Springfield'} image={item.image} />
          </Link>
        )}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        onEndReached={() => {
          if (!isSearching && hasNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingNextPage && !isSearching ? (
            <Text style={styles.footer}>Cargando mas...</Text>
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            title="Sin resultados"
            subtitle="Prueba con otro nombre o limpia la busqueda."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: '#f6f2e9',
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
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
