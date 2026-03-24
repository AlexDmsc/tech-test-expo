# Notes

## Corrections

- `.gitignore` : ajout `.idea/`, `.env`
- `src/data/api.ts` : suppression du système mock, connexion au vrai backend via `EXPO_PUBLIC_API_URL`
- `.env` : création avec `EXPO_PUBLIC_API_URL=https://localhost`
- `config/packages/nelmio_cors.yaml` (backend) : installation `nelmio/cors-bundle` pour autoriser les requêtes cross-origin depuis l'app web

## Architecture

### Structure des features

Adoption d'une architecture orientée features plutôt que technique :

```
src/
  features/events/
    components/   # Composants propres à la feature
    hooks/        # Hooks métier
    pages/        # Pages (consommées par app/)
  modules/
    Calendar/     # Module métier réutilisable
  core/errors/    # Classes d'erreurs typées
  services/common/errors/  # Intercepteur d'erreurs HTTP
  data/           # Schémas Zod + appels API
  components/     # Design system partagé
```

### Design system

Les composants partagés (`Button`, `Card`, `Badge`, `Text`, `Container`) sont dans `src/components/`. Les composants de feature (`EventCard`, `EventCardList`, `EventCardDetail`) sont dans `src/features/events/components/` et consomment le design system.

`EventCard` dispatche vers `EventCardList` (variant liste) ou `EventCardDetail` (variant détail), chacun avec ses propres styles et responsabilités.

## API (API Platform / Hydra)

- Format Hydra JSON-LD (`Accept: application/ld+json`) conservé : standard API Platform, cohérent avec le repo de référence
- Schémas Zod pour valider les réponses : `eventsCollectionSchema` (liste paginée), `eventSchema` (détail)
- Pagination via `hydra:view` + `hydra:next` : approche idiomatique, donne accès à `hydra:totalItems` pour de futures évolutions
- `fetchEvents(page)` retourne `{ items, nextPage }` — abstraction propre qui isole le format Hydra du reste de l'app

## TypeScript

- Zéro `any` sur les données API : tout passe par Zod (`unknown` → type inféré)
- Discriminated union pour les états async : `{ status: 'loading' } | { status: 'error'; message: string } | { status: 'success'; event: Event }` — TypeScript garantit l'accès conditionnel aux propriétés

## Gestion des erreurs

Inspiré de `espace-militant/src/core/errors` et `src/services/common/errors` :

- Classes d'erreurs typées : `NotFoundError`, `ServerTimeoutError`, `BadRequestError`, etc.
- `genericErrorThrower` : intercepte les erreurs Axios et les convertit en classes typées (switch sur le status HTTP, gestion `ECONNABORTED`, `Network Error`)
- Pages : distinction `NotFoundError` ("Événement introuvable") vs `ServerTimeoutError` vs erreur générique

## Performance

- `React.memo` sur `EventCardList` et `EventCardDetail` : évite les re-renders des items existants lors du chargement de pages supplémentaires (infinite scroll)
- `useCallback` sur tous les handlers de `EventListPage` : `loadPage`, `onRefresh`, `onEndReached`, `renderItem`, `keyExtractor`
- `useRef` pour `nextPageRef` : suivi de la pagination sans déclencher de re-render
- `keyExtractor` stable basé sur `item.id`

## Infinite scroll

- `FlatList` avec `onEndReached` + `onEndReachedThreshold={0.3}`
- `RefreshControl` pour le pull-to-refresh
- `ListFooterComponent` avec `ActivityIndicator` pendant le chargement de la page suivante
- Guard `loadingMore` pour éviter les appels simultanés

## Hooks métier

`useEventDetail(id)` : encapsule le fetch, les états et la gestion d'erreurs. Retourne un discriminated union. Les pages `EventDetailPage` sont réduites au pur layout.

## Plateforme

- Fichiers platform-specific (`Calendar.native.ts` / `Calendar.web.ts`) pour les modules avec implémentations fondamentalement différentes — Metro résout automatiquement
- `Platform.OS` réservé aux différences de layout mineures dans une page (`EventDetailPage`) — acceptable car la logique métier est commune

## Bonus — Calendrier

Inspiré de `espace-militant/src/modules/Calendar` :

- `Calendar.native.ts` : `expo-calendar` — vérification permission → demande → fallback `Alert` + lien paramètres si refusée définitivement → `createEventInCalendarAsync` → feedback succès/échec via `Alert`
- `Calendar.web.ts` : `add-to-calendar-button` — dialogue multi-calendriers (Apple, Google, iCal, Microsoft365, Outlook)
- `CalendarTypes.ts` : type `CalendarEvent` partagé entre les deux implémentations
- Pas de tests sur ce module : les librairies tierces (`expo-calendar`, `add-to-calendar-button`) ont leurs propres suites de tests
