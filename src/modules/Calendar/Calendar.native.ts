import {
  createEventInCalendarAsync,
  CalendarDialogResultActions,
  getCalendarPermissionsAsync,
  requestCalendarPermissionsAsync,
} from 'expo-calendar';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

import type { UseAddToCalendar } from './CalendarTypes';

const useAddToCalendar: UseAddToCalendar = () => {
  const manualRequest = () => {
    Alert.alert(
      'Autorisation requise',
      "Activez l'accès au calendrier dans les paramètres, puis réessayez.",
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Ouvrir les paramètres', onPress: () => Linking.openSettings() },
      ],
    );
  };

  return async (event) => {
    const { status, canAskAgain } = await getCalendarPermissionsAsync();

    if (status !== 'granted') {
      if (canAskAgain) {
        const result = await requestCalendarPermissionsAsync();
        if (result.status !== 'granted') {
          manualRequest();
        }
      } else {
        manualRequest();
      }
      return;
    }

    try {
      const result = await createEventInCalendarAsync({
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate ?? event.startDate,
        location: event.location ?? undefined,
        notes: event.notes ?? undefined,
        timeZone: event.timeZone ?? 'Europe/Paris',
      });

      if (
        result.action === CalendarDialogResultActions.saved ||
        result.action === CalendarDialogResultActions.done
      ) {
        Alert.alert('Calendrier', "L'événement a bien été ajouté au calendrier.");
      }
    } catch {
      Alert.alert('Erreur', "Nous n'avons pas pu ajouter l'événement au calendrier.");
    }
  };
};

export default useAddToCalendar;
