import type { BadgeColor } from '@/components/Badge';

export type { BadgeColor };

type Category = { name: string };

export type EventCardListProps = {
  variant: 'list';
  title: string;
  date: string;
  location?: string | null;
  imageUrl?: string | null;
  category?: Category | null;
  onPress: () => void;
};

export type EventCardDetailProps = {
  variant: 'detail';
  title: string;
  date: string;
  location?: string | null;
  category?: Category | null;
  description?: string | null;
  imageUrl?: string | null;
  onAddToCalendar: () => void;
  onRegister: () => void;
};

export type EventCardProps = EventCardListProps | EventCardDetailProps;

const BADGE_COLORS: BadgeColor[] = ['blue', 'green', 'neutral'];

export function getCategoryColor(name: string): BadgeColor {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return BADGE_COLORS[hash % BADGE_COLORS.length];
}
