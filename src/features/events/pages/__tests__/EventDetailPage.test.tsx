import { render, screen, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { useEventDetail } from '../../hooks/useEventDetail';
import { useAddToCalendar } from '@/modules/Calendar';
import { EventDetailPage } from '../EventDetailPage';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ id: '1' }),
}));
jest.mock('../../hooks/useEventDetail');
jest.mock('@/modules/Calendar');

const mockUseEventDetail = useEventDetail as jest.MockedFunction<typeof useEventDetail>;
const mockUseAddToCalendar = useAddToCalendar as jest.MockedFunction<typeof useAddToCalendar>;

const mockEvent = {
  id: '1',
  title: 'Conférence React Native',
  date: '2026-06-15T10:00:00Z',
  description: 'Une conférence passionnante.',
  location: 'Paris',
  imageUrl: null,
  category: { id: 'cat-1', name: 'Tech' },
};

describe('EventDetailPage', () => {
  beforeEach(() => {
    mockUseAddToCalendar.mockReturnValue(jest.fn());
  });

  afterEach(() => jest.clearAllMocks());

  it('affiche un indicateur de chargement pendant le fetch', () => {
    // Given
    mockUseEventDetail.mockReturnValue({ status: 'loading' });

    // When
    render(<EventDetailPage />);

    // Then
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('affiche le message d\'erreur quand l\'événement est introuvable', () => {
    // Given
    mockUseEventDetail.mockReturnValue({ status: 'error', message: 'Cet événement est introuvable.' });

    // When
    render(<EventDetailPage />);

    // Then
    expect(screen.getByText('Cet événement est introuvable.')).toBeTruthy();
  });

  it('affiche les détails de l\'événement en cas de succès', () => {
    // Given
    mockUseEventDetail.mockReturnValue({ status: 'success', event: mockEvent });

    // When
    render(<EventDetailPage />);

    // Then
    expect(screen.getByText('Conférence React Native')).toBeTruthy();
    expect(screen.getByText('Paris')).toBeTruthy();
    expect(screen.getByText('Une conférence passionnante.')).toBeTruthy();
  });

  it('appelle addToCalendar avec les données de l\'événement au clic', () => {
    // Given
    const mockAddToCalendar = jest.fn();
    mockUseAddToCalendar.mockReturnValue(mockAddToCalendar);
    mockUseEventDetail.mockReturnValue({ status: 'success', event: mockEvent });

    // When
    render(<EventDetailPage />);
    fireEvent.press(screen.getByText('Ajouter au calendrier'));

    // Then
    expect(mockAddToCalendar).toHaveBeenCalledWith({
      title: mockEvent.title,
      startDate: new Date(mockEvent.date),
      location: mockEvent.location,
      notes: mockEvent.description,
    });
  });
});
