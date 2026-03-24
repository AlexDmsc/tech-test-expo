import axios from 'axios';
import { eventSchema, eventsCollectionSchema, type Event, type EventListItem } from './schema';
import { genericErrorThrower } from '@/services/common/errors/generic-errors';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Accept: 'application/ld+json',
  },
});

export type EventsPage = {
  items: EventListItem[];
  nextPage: number | null;
};

export async function fetchEvents(page = 1): Promise<EventsPage> {
  try {
    const response = await api.get<unknown>('/api/events', { params: { page } });
    const data = eventsCollectionSchema.parse(response.data);
    const next = data['hydra:view']?.['hydra:next'];
    return { items: data['hydra:member'], nextPage: next ? page + 1 : null };
  } catch (error) {
    throw genericErrorThrower(error);
  }
}

export async function fetchEventById(id: string): Promise<Event> {
  try {
    const response = await api.get<unknown>(`/api/events/${id}`);
    return eventSchema.parse(response.data);
  } catch (error) {
    throw genericErrorThrower(error);
  }
}
