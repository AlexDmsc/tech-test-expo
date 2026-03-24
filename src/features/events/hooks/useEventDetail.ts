import { useEffect, useState } from 'react';

import { fetchEventById } from '@/data/api';
import { NotFoundError, ServerTimeoutError } from '@/core/errors';
import type { Event } from '@/data/schema';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; event: Event };

export function useEventDetail(id: string | undefined) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (!id) return;
    setState({ status: 'loading' });
    fetchEventById(id)
      .then(event => setState({ status: 'success', event }))
      .catch(err => {
        if (err instanceof NotFoundError) {
          setState({ status: 'error', message: 'Cet événement est introuvable.' });
        } else if (err instanceof ServerTimeoutError) {
          setState({ status: 'error', message: 'Le serveur ne répond pas. Veuillez réessayer.' });
        } else {
          setState({ status: 'error', message: 'Une erreur est survenue lors du chargement.' });
        }
      });
  }, [id]);

  return state;
}
