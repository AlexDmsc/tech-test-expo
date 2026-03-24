import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { Container } from '@/components/Container';
import { EventCard } from '../components/EventCard';
import { Text } from '@/components/Text';
import { useEventDetail } from '../hooks/useEventDetail';
import { useAddToCalendar } from '@/modules/Calendar';

export function EventDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const state = useEventDetail(id);
  const addToCalendar = useAddToCalendar();

  if (state.status === 'loading') {
    return (
      <Container style={styles.centered} safeAreaEdges={['bottom']}>
        <ActivityIndicator size="large" />
      </Container>
    );
  }

  if (state.status === 'error') {
    return (
      <Container style={styles.centered} safeAreaEdges={['bottom']}>
        <Text size="M" muted>{state.message}</Text>
      </Container>
    );
  }

  return (
    <Container style={styles.container} safeAreaEdges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {Platform.OS === 'web' ? (
          <View style={styles.webContent}>
            <EventCard
              variant="detail"
              title={state.event.title}
              date={state.event.date}
              location={state.event.location}
              category={state.event.category}
              description={state.event.description}
              imageUrl={state.event.imageUrl}
              onAddToCalendar={() => addToCalendar({ title: state.event.title, startDate: new Date(state.event.date), location: state.event.location, notes: state.event.description })}
              onRegister={() => {}}
            />
          </View>
        ) : (
          <EventCard
            variant="detail"
            title={state.event.title}
            date={state.event.date}
            location={state.event.location}
            category={state.event.category}
            description={state.event.description}
            imageUrl={state.event.imageUrl}
            onAddToCalendar={() => {}}
            onRegister={() => {}}
          />
        )}
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
    padding: 16,
    ...(Platform.OS === 'web' && {
      alignItems: 'center' as const,
      paddingVertical: 20,
      paddingHorizontal: 20,
    }),
  },
  webContent: {
    width: '100%',
    maxWidth: 680,
  },
});
