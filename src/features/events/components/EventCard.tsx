import { type EventCardProps } from './EventCard.types';
import { EventCardDetail } from './EventCardDetail';
import { EventCardList } from './EventCardList';

export type { EventCardProps };

export function EventCard(props: EventCardProps) {
  if (props.variant === 'list') {
    return <EventCardList {...props} />;
  }
  return <EventCardDetail {...props} />;
}
