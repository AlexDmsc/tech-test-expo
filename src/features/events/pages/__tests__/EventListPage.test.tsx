import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import { fetchEvents } from '@/data/api';
import { ServerTimeoutError } from '@/core/errors';
import { EventListPage } from '../EventListPage';

jest.mock('@/data/api');
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockFetchEvents = fetchEvents as jest.MockedFunction<typeof fetchEvents>;

const mockEvents = [
  { id: '1', title: 'Conférence React', date: '2026-06-15T10:00:00Z', location: 'Paris', imageUrl: null, category: { id: 'c1', name: 'Tech' } },
  { id: '2', title: 'Atelier Design', date: '2026-07-01T09:00:00Z', location: 'Lyon', imageUrl: null, category: null },
];

describe('EventListPage', () => {
  afterEach(() => jest.clearAllMocks());

  it('affiche un indicateur de chargement au démarrage', () => {
    // Given
    mockFetchEvents.mockResolvedValue({ items: mockEvents, nextPage: null });

    // When
    render(<EventListPage />);

    // Then
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('affiche la liste des événements après le chargement', async () => {
    // Given
    mockFetchEvents.mockResolvedValue({ items: mockEvents, nextPage: null });

    // When
    render(<EventListPage />);

    // Then
    await waitFor(() => expect(screen.getByText('Conférence React')).toBeTruthy());
    expect(screen.getByText('Atelier Design')).toBeTruthy();
  });

  it('affiche un message d\'erreur si le fetch échoue', async () => {
    // Given
    mockFetchEvents.mockRejectedValue(new ServerTimeoutError('Timeout'));

    // When
    render(<EventListPage />);

    // Then
    await waitFor(() =>
      expect(screen.getByText('Le serveur ne répond pas. Veuillez réessayer.')).toBeTruthy(),
    );
  });

  it('affiche "Aucun événement" si la liste est vide', async () => {
    // Given
    mockFetchEvents.mockResolvedValue({ items: [], nextPage: null });

    // When
    render(<EventListPage />);

    // Then
    await waitFor(() => expect(screen.getByText('Aucun événement')).toBeTruthy());
  });

  it('navigue vers la page détail au clic sur un événement', async () => {
    // Given
    const mockPush = jest.fn();
    jest.mocked(require('expo-router').useRouter).mockReturnValue({ push: mockPush });
    mockFetchEvents.mockResolvedValue({ items: mockEvents, nextPage: null });

    // When
    render(<EventListPage />);
    await waitFor(() => screen.getByText('Conférence React'));
    fireEvent.press(screen.getByText('Conférence React'));

    // Then
    expect(mockPush).toHaveBeenCalledWith('/events/1');
  });

  it('charge la page suivante en fin de liste', async () => {
    // Given
    mockFetchEvents
      .mockResolvedValueOnce({ items: mockEvents, nextPage: 2 })
      .mockResolvedValueOnce({ items: [{ id: '3', title: 'Meetup JS', date: '2026-08-01T10:00:00Z', location: null, imageUrl: null, category: null }], nextPage: null });

    // When
    render(<EventListPage />);
    await waitFor(() => screen.getByText('Conférence React'));
    fireEvent(screen.getByTestId('events-list'), 'onEndReached');

    // Then
    await waitFor(() => expect(mockFetchEvents).toHaveBeenCalledWith(2));
  });
});
