Read `CLAUDE.md`, `docs/00-product-spec.md`, and `docs/refined-spec.md` if it exists.
Use the project subagents.

Rules:
- keep normal shirtless gym photos in the main roll by default
- classify into `safe`, `suggestive_but_safe`, `explicit`, and `uncertain`
- no delete flow in phase 1
- only exact explicit duplicates may be auto-queued after verified upload succeeds
- near-duplicate explicit items must be grouped for review
- no non-explicit auto-delete

Execution order:
1. Build project foundation and scripts
2. Build permission flow and gallery review UI
3. Build Dropbox OAuth and upload flow
4. Add classification helpers and manual override UX
5. Add duplicate grouping and exact duplicate queue
6. Add QA coverage and docs

Start with `tech-lead`, then delegate intentionally.
Keep changes incremental.
After each phase, summarize what changed, what still fails, and the next smallest task.
