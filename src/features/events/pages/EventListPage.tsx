import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Container } from '@/components/Container';
import { EventCard } from '../components/EventCard';
import { Text } from '@/components/Text';
import { fetchEvents } from '@/data/api';
import { ServerTimeoutError } from '@/core/errors';
import type { EventListItem } from '@/data/schema';

export function EventListPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextPageRef = useRef<number | null>(1);

  const loadPage = useCallback(async (page: number, replace: boolean) => {
    try {
      setError(null);
      const result = await fetchEvents(page);
      setEvents(prev => replace ? result.items : [...prev, ...result.items]);
      nextPageRef.current = result.nextPage;
    } catch (err) {
      if (err instanceof ServerTimeoutError) {
        setError('Le serveur ne répond pas. Veuillez réessayer.');
      } else {
        setError('Une erreur est survenue lors du chargement.');
      }
    }
  }, []);

  useEffect(() => {
    loadPage(1, true).finally(() => setLoading(false));
  }, [loadPage]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }, [loadPage]);

  const onEndReached = useCallback(async () => {
    if (loadingMore || nextPageRef.current === null) return;
    setLoadingMore(true);
    await loadPage(nextPageRef.current, false);
    setLoadingMore(false);
  }, [loadingMore, loadPage]);

  const renderItem = useCallback(
    ({ item }: { item: EventListItem }) => (
      <EventCard
        variant="list"
        title={item.title}
        date={item.date}
        location={item.location}
        category={item.category}
        imageUrl={item.imageUrl}
        onPress={() => router.push(`/events/${item.id}`)}
      />
    ),
    [router],
  );

  const keyExtractor = useCallback((item: EventListItem) => item.id, []);

  if (loading) {
    return (
      <Container style={styles.centered} safeAreaEdges={['top']}>
        <ActivityIndicator size="large" />
      </Container>
    );
  }

  if (error && events.length === 0) {
    return (
      <Container style={styles.centered} safeAreaEdges={['top']}>
        <Text size="L" style={styles.errorText}>{error}</Text>
      </Container>
    );
  }

  return (
    <Container style={styles.container} safeAreaEdges={['top']}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<Text size="XL" style={styles.header}>Événements</Text>}
        ListEmptyComponent={<Text size="M" muted style={styles.emptyText}>Aucun événement</Text>}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator style={styles.footer} /> : null
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#c62828',
  },
  header: {
    marginBottom: 16,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  footer: {
    paddingVertical: 20,
  },
});
