import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Text } from '@/components/Text';
import { radius } from '@/constants/theme';
import { formatDate } from '@/helpers';

import { getCategoryColor, type EventCardProps } from './EventCard.types';

export type { EventCardProps };

export function EventCard(props: EventCardProps) {
  if (props.variant === 'list') {
    const { title, date, location, imageUrl, category, onPress } = props;
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        <Card style={styles.listCard}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.listImage} contentFit="cover" />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
          <View style={styles.listContent}>
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
  }

  const { title, date, location, category, description, imageUrl, onAddToCalendar, onRegister } = props;
  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <View style={styles.detailTitleRow}>
          <Text size="XL" style={styles.detailTitle}>{title}</Text>
          {category ? (
            <Badge color={getCategoryColor(category.name)}>{category.name}</Badge>
          ) : null}
        </View>
        <Text size="S" muted>{formatDate(date, 'dateOnly')}</Text>
        {location ? <Text size="S" muted>{location}</Text> : null}
      </View>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.detailImage} contentFit="cover" />
      ) : (
        <View style={styles.detailImagePlaceholder} />
      )}
      {description ? (
        <Text size="M" style={styles.description}>{description}</Text>
      ) : null}
      <View style={styles.actions}>
        <View style={styles.buttonsRow}>
          <Button color="neutral" size="lg" onPress={onAddToCalendar}>Ajouter au calendrier</Button>
          <Button color="blue" size="lg" onPress={onRegister}>Je m'inscris</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.8,
  },
  listCard: {
    padding: 12,
    flexDirection: 'row',
    gap: 12,
  },
  listImage: {
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
  listContent: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  detailContainer: {
    gap: 16,
  },
  detailHeader: {
    gap: 4,
  },
  detailTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  detailTitle: {
    flex: 1,
  },
  detailImage: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
  },
  detailImagePlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: '#e0e0e0',
  },
  description: {
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 12,
  },
});
