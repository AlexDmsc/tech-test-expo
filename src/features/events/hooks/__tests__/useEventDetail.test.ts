import { renderHook, waitFor } from '@testing-library/react-native';

import { fetchEventById } from '@/data/api';
import { NotFoundError, ServerTimeoutError } from '@/core/errors';
import { useEventDetail } from '../useEventDetail';

jest.mock('@/data/api');

const mockFetchEventById = fetchEventById as jest.MockedFunction<typeof fetchEventById>;

const mockEvent = {
  id: '1',
  title: 'Conférence React Native',
  date: '2026-06-15T10:00:00Z',
  description: 'Une conférence sur React Native.',
  location: 'Paris',
  imageUrl: 'https://example.com/image.jpg',
  category: { id: 'cat-1', name: 'Tech' },
};

describe('useEventDetail', () => {
  afterEach(() => jest.clearAllMocks());

  it('retourne loading initialement', () => {
    // Given
    mockFetchEventById.mockResolvedValue(mockEvent);

    // When
    const { result } = renderHook(() => useEventDetail('1'));

    // Then
    expect(result.current.status).toBe('loading');
  });

  it('retourne success avec les données de l\'événement', async () => {
    // Given
    mockFetchEventById.mockResolvedValue(mockEvent);

    // When
    const { result } = renderHook(() => useEventDetail('1'));

    // Then
    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current).toMatchObject({ status: 'success', event: mockEvent });
    expect(mockFetchEventById).toHaveBeenCalledWith('1');
  });

  it('retourne une erreur "introuvable" pour un ID inconnu (404)', async () => {
    // Given
    mockFetchEventById.mockRejectedValue(new NotFoundError('Not found'));

    // When
    const { result } = renderHook(() => useEventDetail('unknown-id'));

    // Then
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current).toMatchObject({
      status: 'error',
      message: 'Cet événement est introuvable.',
    });
  });

  it('retourne une erreur réseau pour un timeout serveur', async () => {
    // Given
    mockFetchEventById.mockRejectedValue(new ServerTimeoutError('Timeout'));

    // When
    const { result } = renderHook(() => useEventDetail('1'));

    // Then
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current).toMatchObject({
      status: 'error',
      message: 'Le serveur ne répond pas. Veuillez réessayer.',
    });
  });

  it('retourne une erreur générique pour les autres erreurs', async () => {
    // Given
    mockFetchEventById.mockRejectedValue(new Error('Unexpected error'));

    // When
    const { result } = renderHook(() => useEventDetail('1'));

    // Then
    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current).toMatchObject({
      status: 'error',
      message: 'Une erreur est survenue lors du chargement.',
    });
  });

  it('ne fait pas de requête si l\'id est undefined', () => {
    // Given / When
    renderHook(() => useEventDetail(undefined));

    // Then
    expect(mockFetchEventById).not.toHaveBeenCalled();
  });
});
