# Refined Product Spec — Media Cleaner

_Generated 2026-04-02 from interview + CLAUDE.md_

---

## Platform

- **iOS only** (iPhone)
- React Native + Expo + TypeScript
- **Expo Go first** — use Expo-compatible APIs throughout Phase 1–2; graduate to a dev build (EAS Build) only if a native module is blocked by Expo Go
- Local-first architecture; no backend in v1

---

## Media types

- **Photos and Videos** both included
- Photos are the primary focus — all classification, duplicate detection, and review flows are built around photos first
- Videos are shown in the library and can be reviewed and uploaded to Dropbox, but video-specific duplicate detection is deferred to a later phase (perceptual hashing on video is significantly harder)
- Both are subject to the same four-bucket classification system

---

## Classification buckets

| Bucket | Description | Default fate |
|---|---|---|
| `safe` | Normal everyday photos/videos, gym shots, etc. | Stay in camera roll |
| `suggestive_but_safe` | Shirtless gym photos, underwear, borderline content | Stay in camera roll |
| `explicit` | Adult content intended for upload | Eligible for Dropbox upload |
| `uncertain` | Ambiguous — classifier or user is unsure | Always requires manual review |

Rules:
- Default ambiguous content to `uncertain` or `suggestive_but_safe`, never `explicit`
- Never auto-delete non-explicit content
- `uncertain` items are never auto-acted upon

---

## Review UX

- **Swipe cards** — one item at a time
- Swipe right = Keep in camera roll (safe / suggestive_but_safe)
- Swipe left = Mark for upload queue (explicit)
- Tap card = Open detail view with manual bucket picker (all four options)
- Filters at the top of the library grid let users view by bucket
- Review sessions can be paused and resumed; progress is saved locally

---

## Dropbox integration

- OAuth 2.0 (PKCE) — no client secret stored on device
- Folder structure:
  ```
  /MediaCleaner/Explicit/YYYY/MM/   ← approved explicit uploads
  /MediaCleaner/Review/YYYY/MM/     ← uncertain items flagged for off-device review
  /MediaCleaner/Exports/Logs/       ← local audit log exports (future)
  ```
- Upload only happens after explicit user confirmation
- Upload success is tracked locally (asset ID + Dropbox path + timestamp)
- No hard-delete from Dropbox in v1

---

## Duplicate detection

### Exact duplicates
- SHA-256 hash of file bytes
- Only among items classified as `explicit`
- Exact duplicates are auto-queued for deletion **only after verified upload succeeds**
- User sees a confirmation list before deletion executes

### Near-duplicate grouping
- **Conservative threshold** — only group items that are nearly identical (burst shots, minor crop/brightness differences)
- Perceptual hash (pHash or similar) with a tight similarity distance
- Near-duplicates are surfaced as a review group; user picks the preferred copy
- Nothing is deleted silently — user must confirm per group

---

## Trash / undo buffer

- **30-day soft delete**
- When an item is deleted from the camera roll, it moves to an in-app trash store (local SQLite / AsyncStorage)
- Trash auto-purges items older than 30 days
- User can browse and restore any item within the 30-day window
- Actual OS-level deletion only happens when purged from trash or manually emptied

---

## Wording and UI language

- Plain, clear language: Keep, Upload, Explicit, Safe, Uncertain, Suggestive
- No clinical or euphemistic substitutions required
- Classification labels are shown in the UI as-is

---

## Privacy and safety rules

- On-device processing wherever possible
- Never claim the classifier is perfect — show confidence where displayed
- Require explicit user action before any upload or deletion
- Audit trail: local record of every classification change, upload, and deletion queue entry
- No auto-delete in Phase 1; delete queue is the last feature built

---

## Build order (phases)

### Phase 1 — Foundation
- Project setup (Expo + TypeScript)
- iOS photo/video library permission flow
- Gallery grid view (photos + videos from camera roll)
- Swipe-card review UI
- Manual bucket assignment (all four buckets)
- Local state persistence

### Phase 2 — Dropbox
- Dropbox OAuth (PKCE)
- Upload flow with confirmation step
- Folder organization (`/MediaCleaner/Explicit/YYYY/MM`)
- Local upload status tracking

### Phase 3 — Classification + Deduplication
- Classification helper pipeline (on-device model or heuristic)
- Exact duplicate detection (SHA-256, explicit items only)
- Near-duplicate grouping (conservative pHash threshold, explicit items only)

### Phase 4 — Delete queue + Safety
- 30-day soft-delete trash buffer
- Delete queue (only after verified upload, explicit items only)
- Confirmation UI before any OS-level deletion

### Phase 5 — QA + Docs
- Full QA pass
- Release notes
- `docs/build-summary.md` updated

---

## Definition of done (v1)

- [ ] App launches in Expo Go on iPhone
- [ ] Photo and video permission flow works
- [ ] User can browse and swipe-review media
- [ ] Shirtless gym photos default to `suggestive_but_safe`, stay in camera roll
- [ ] Dropbox OAuth connects and uploads work
- [ ] Explicit uploads land in `/MediaCleaner/Explicit/YYYY/MM`
- [ ] Exact explicit duplicate queue activates only after verified upload
- [ ] Near-duplicate explicit items are grouped for review (conservative threshold)
- [ ] 30-day trash buffer protects against accidental deletion
- [ ] No non-explicit photos are auto-deleted
- [ ] Docs and QA report are complete
