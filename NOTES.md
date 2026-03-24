# Notes

## Corrections
- `.gitignore` : ajout `.idea/`, `.env`
- Suppression du système mock, connexion au backend via `EXPO_PUBLIC_API_URL`
- Backend : installation `nelmio/cors-bundle` pour résoudre les erreurs CORS

## Architecture
- Structure orientée features : `src/features/events/`, `src/modules/Calendar/`
- `EventCard` découpé en `EventCardList` + `EventCardDetail` — responsabilité unique
- `useEventDetail` hook : isole la logique fetch/états des pages
- Fichiers platform-specific (`Calendar.native.ts` / `Calendar.web.ts`) pour les implémentations fondamentalement différentes

## API
- Format Hydra JSON-LD conservé : standard API Platform, donne accès à `hydra:totalItems` pour de futures évolutions
- Schémas Zod sur toutes les réponses : zéro `any`, validation à la frontière

## Gestion des erreurs
Inspiré de `espace-militant/src/core/errors` :
- Classes typées : `NotFoundError`, `ServerTimeoutError`, `BadRequestError`…
- `genericErrorThrower` : convertit les erreurs Axios en classes typées
- Pages : messages distincts selon le type d'erreur (404 vs réseau vs générique)

## Performance
- `React.memo` sur les composants de liste : évite les re-renders lors du chargement des pages suivantes
- `useCallback` sur tous les handlers de `EventListPage`
- `useRef` pour la pagination : pas de re-render inutile

## Bonus — Calendrier
Inspiré de `espace-militant/src/modules/Calendar` :
- **Native** : `expo-calendar` — gestion permissions + fallback vers les paramètres système + feedback `Alert`
- **Web** : `add-to-calendar-button` — dialogue multi-calendriers (Apple, Google, iCal, Microsoft365, Outlook)
