import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { Container } from '@/components/Container';
import { EventCard } from '../components/EventCard';
import { Text } from '@/components/Text';
import { fetchEventById } from '@/data/api';
import { NotFoundError, ServerTimeoutError } from '@/core/errors';
import type { Event } from '@/data/schema';

export function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function loadEvent() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        if (err instanceof NotFoundError) {
          setError('Cet événement est introuvable.');
        } else if (err instanceof ServerTimeoutError) {
          setError('Le serveur ne répond pas. Veuillez réessayer.');
        } else {
          setError('Une erreur est survenue lors du chargement.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <Container style={styles.centered} safeAreaEdges={['bottom']}>
        <ActivityIndicator size="large" />
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container style={styles.centered} safeAreaEdges={['bottom']}>
        <Text size="M" muted>{error ?? 'Événement introuvable'}</Text>
      </Container>
    );
  }

  return (
    <Container style={styles.container} safeAreaEdges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <EventCard
            variant="detail"
            title={event.title}
            date={event.date}
            location={event.location}
            category={event.category}
            description={event.description}
            imageUrl={event.imageUrl}
            onAddToCalendar={() => {}}
            onRegister={() => {}}
          />
        </View>
      </ScrollView>
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
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
    maxWidth: 680,
  },
});
