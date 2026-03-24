export type CalendarEvent = {
  title: string;
  startDate: Date;
  endDate?: Date;
  location?: string | null;
  notes?: string | null;
  timeZone?: string;
};

export type UseAddToCalendar = () => (event: CalendarEvent) => Promise<void>;
