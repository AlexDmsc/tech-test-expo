import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const eventListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  location: z.string().nullish(),
  imageUrl: z.string().nullish(),
  category: categorySchema.nullish(),
});

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullish(),
  date: z.string(),
  location: z.string().nullish(),
  imageUrl: z.string().nullish(),
  category: categorySchema.nullish(),
});

export const eventsCollectionSchema = z.object({
  'hydra:member': z.array(eventListItemSchema),
  'hydra:totalItems': z.number(),
  'hydra:view': z.object({
    'hydra:next': z.string().optional(),
  }).optional(),
});

export type EventListItem = z.infer<typeof eventListItemSchema>;
export type Event = z.infer<typeof eventSchema>;
