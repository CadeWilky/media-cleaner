# Product Spec — Mobile Media Cleaner / Organizer

## Goal
Build a privacy-first mobile app that helps the user review personal media, keep safe or merely suggestive photos in the main camera roll, upload approved explicit media to Dropbox, and reduce clutter by identifying exact and near-duplicate explicit images.

## User intent
- Keep ordinary camera roll content where it belongs
- Avoid losing normal shirtless gym photos
- Upload approved explicit media to Dropbox in an organized way
- Remove only confirmed explicit duplicates or review-grouped near-duplicates from the main camera roll

## Classification buckets
- `safe`
- `suggestive_but_safe`
- `explicit`
- `uncertain`

## Key rules
- Shirtless gym photos usually belong in `suggestive_but_safe`, not `explicit`
- `explicit` items can be selected for Dropbox upload
- `uncertain` items always require review
- Exact explicit duplicates can be queued for deletion only after verified upload
- Near-duplicate explicit images are grouped for review, not silently deleted
- Non-explicit photos remain in the main camera roll

## Phase priorities
### Phase 1
- Project setup
- Media permission flow
- Gallery and review UI
- Manual bucket assignment

### Phase 2
- Dropbox OAuth
- Upload flow
- Folder organization
- Local upload status tracking

### Phase 3
- Classification helper pipeline
- Exact duplicate detection
- Near-duplicate grouping

### Phase 4
- Delete queue
- QA
- Docs
