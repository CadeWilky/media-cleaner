# Build Summary

## Phase 1 — Foundation (complete)
- Expo + React Native + TypeScript scaffold with expo-router
- `usePermission` hook — photo library permission gate
- `useMediaLibrary` hook — paginates device assets, merges with AsyncStorage
- `lib/storage.ts` — AsyncStorage CRUD for `MediaAsset` records
- `lib/assetNormalizer.ts` — normalizes `expo-media-library` assets to `MediaAsset`
- Gallery tab with `GalleryGrid` + `GalleryItem` + `BucketFilter` components
- All new assets default to `uncertain` bucket

## Phase 2 — Review UX (complete)
- `hooks/useReviewQueue.ts` — loads `uncertain` assets from AsyncStorage on tab focus; exposes `assignBucket` (persists + removes from queue) and `skip` (rotates to back of queue)
- `components/review/SwipeCard.tsx` — reanimated + gesture-handler swipe card:
  - Swipe right → Safe
  - Swipe left → Explicit
  - Swipe up → Suggestive
  - Swipe down / release within threshold → Skip
  - Per-direction animated badge overlays (SAFE / EXPLICIT / SUGGESTIVE)
  - Stacked peek cards behind active card for depth effect
- `components/review/BucketActions.tsx` — four tap buttons (Safe, Suggestive, Explicit, Skip) as an alternative to swiping
- Review tab (`app/(tabs)/index.tsx`) rewritten:
  - Seeds AsyncStorage via `useMediaLibrary` on first load
  - Reads queue from `useReviewQueue` (not a second media library fetch)
  - Empty state when all items are reviewed
  - Swipe direction hint line above action buttons

## Assumptions
- Assets start as `uncertain` — no classifier runs yet
- Review tab seeds storage by calling `fetchPage` from `useMediaLibrary`; this is intentional to avoid duplicating seeding logic
- `GestureHandlerRootView` is scoped to the Review screen; if future tabs need gestures, move it to the root layout
- `clamp` from reanimated is used for hint opacity — verified available in reanimated 4.x

## Phase 3 prerequisites
- Dropbox OAuth setup (`expo-auth-session` already installed)
- Upload flow for `explicit` bucket assets
- Folder structure: `/MediaCleaner/Explicit/YYYY/MM`
