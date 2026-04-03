# CLAUDE.md

## Project
Build a privacy-first mobile app that helps the user review personal media, keep non-explicit photos like normal shirtless gym pictures in the main camera roll, upload approved explicit media to Dropbox, and organize uploaded media safely.

## Locked platform
- Mobile app only
- React Native + Expo + TypeScript
- Local-first architecture in v1
- No backend service in v1 unless explicitly requested later
- Dropbox OAuth for uploads and folder organization

## Core product rules
1. Shirtless gym photos should generally remain in the main camera roll.
2. Classify media into four buckets:
   - `safe`
   - `suggestive_but_safe`
   - `explicit`
   - `uncertain`
3. Only `explicit` items are eligible for automated Dropbox upload flows.
4. `suggestive_but_safe` items stay on the regular camera roll by default.
5. `uncertain` items always require review.
6. No auto-delete in phase 1.
7. Only exact explicit duplicates may be auto-queued for deletion, and only after verified upload succeeds.
8. Near-duplicate explicit photos must be grouped for review, not silently deleted.
9. Non-explicit photos must never be auto-deleted.
10. Deletion logic comes last, after permissions, review UX, Dropbox upload, and duplicate grouping are all working.

## Privacy and safety rules
- Prefer on-device processing whenever possible.
- Never claim the classifier is perfect.
- Treat ambiguous content conservatively.
- Default ambiguous images to `uncertain` or `suggestive_but_safe`, not `explicit`.
- Require an explicit user action before upload or deletion.
- Keep an audit trail in local app state for what was marked, uploaded, or queued.
- Do not hard-delete anything from Dropbox in v1.

## v1 scope
### Required features
- Ask for photo library permission
- Show recent media from the camera roll
- Allow manual review and reclassification
- Provide filters for the four buckets
- Connect to Dropbox with OAuth
- Upload approved explicit items to organized Dropbox folders
- Track upload success locally
- Detect exact duplicates among explicit items
- Group likely near-duplicates among explicit items for review
- Queue exact explicit duplicates for deletion only after verified upload

### Not in v1
- Cloud backend
- Accounts/auth beyond Dropbox OAuth
- Payments/subscriptions
- Automatic permanent deletion without review
- Claims of perfect NSFW detection

## Suggested Dropbox organization
- `/MediaCleaner/Explicit/YYYY/MM`
- `/MediaCleaner/Review/YYYY/MM`
- `/MediaCleaner/Exports/Logs`

## Agent usage rules
- Use project subagents from `.claude/agents/`.
- Start with `tech-lead`.
- For large work, inspect and plan before editing.
- Keep changes incremental and testable.
- Document assumptions in `docs/build-summary.md`.

## Build order
1. Spec and plan
2. Media permission flow
3. Gallery and review UX
4. Dropbox auth and upload
5. Classification support
6. Exact duplicate detection
7. Near-duplicate grouping
8. Delete queue and safety checks
9. QA and release notes

## Definition of done for v1
- App launches in Expo
- Photo permission flow works
- User can browse and review media
- User can keep normal shirtless gym photos in the main roll
- Dropbox connection works
- Explicit uploads are organized into predictable folders
- Exact explicit duplicate queue works only after verified upload
- Near-duplicate explicit items are grouped for review
- No non-explicit photos are auto-deleted
- Docs and QA report are updated
