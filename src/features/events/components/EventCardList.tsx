import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { Text } from '@/components/Text';
import { radius } from '@/constants/theme';
import { formatDate } from '@/helpers';

import { getCategoryColor, type EventCardListProps } from './EventCard.types';

export const EventCardList = memo(function EventCardList({
  title,
  date,
  location,
  imageUrl,
  category,
  onPress,
}: EventCardListProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card style={styles.card}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <View style={styles.content}>
          {category ? (
            <Badge color={getCategoryColor(category.name)}>{category.name}</Badge>
          ) : null}
          <Text size="L" numberOfLines={1}>{title}</Text>
          <Text size="S" muted>{formatDate(date, 'dateOnly')}</Text>
          {location ? <Text size="S" muted>{location}</Text> : null}
        </View>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
  card: {
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    flexShrink: 0,
  },
  imagePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: '#e0e0e0',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
});
