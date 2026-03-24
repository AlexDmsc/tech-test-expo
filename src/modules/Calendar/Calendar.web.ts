import { atcb_action } from 'add-to-calendar-button';
import { format } from 'date-fns';

import type { UseAddToCalendar } from './CalendarTypes';

const useAddToCalendar: UseAddToCalendar = () => {
  return async (event) => {
    try {
      const endDate = event.endDate ?? event.startDate;
      await atcb_action({
        name: event.title,
        description: event.notes ?? undefined,
        startDate: format(event.startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        startTime: format(event.startDate, 'HH:mm'),
        endTime: format(endDate, 'HH:mm'),
        location: event.location ?? undefined,
        timeZone: event.timeZone ?? 'Europe/Paris',
        language: 'fr',
        options: ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com'],
      });
    } catch {
      console.error("Nous n'avons pas pu ajouter l'événement au calendrier.");
    }
  };
};

export default useAddToCalendar;
