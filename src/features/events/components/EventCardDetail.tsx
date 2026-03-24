import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Text } from '@/components/Text';
import { radius } from '@/constants/theme';
import { formatDate } from '@/helpers';

import { getCategoryColor, type EventCardDetailProps } from './EventCard.types';

export const EventCardDetail = memo(function EventCardDetail({
  title,
  date,
  location,
  category,
  description,
  imageUrl,
  onAddToCalendar,
  onRegister,
}: EventCardDetailProps) {
  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text size="XL" style={styles.title}>{title}</Text>
          {category ? (
            <Badge color={getCategoryColor(category.name)}>{category.name}</Badge>
          ) : null}
        </View>
        <Text size="S" muted>{formatDate(date, 'dateOnly')}</Text>
        {location ? <Text size="S" muted>{location}</Text> : null}
      </View>
      <View style={styles.imageWrapper}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
      </View>
      {description ? (
        <Text size="S" muted>{description}</Text>
      ) : null}
      <View style={styles.actions}>
        <Button color="neutral" size="lg" fullWidth onPress={onAddToCalendar}>Ajouter au calendrier</Button>
        <Button color="blue" size="lg" fullWidth onPress={onRegister}>Je m'inscris</Button>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 20,
  },
  header: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    flex: 1,
  },
  imageWrapper: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    maxWidth: 370,
    aspectRatio: 1,
    borderRadius: radius.lg,
  },
  imagePlaceholder: {
    width: '100%',
    maxWidth: 370,
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: '#e0e0e0',
  },
  actions: {
    gap: 12,
  },
});
