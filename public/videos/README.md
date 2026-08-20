# Demo hearing videos

Place dummy MP4 files here for the mock virtual courtroom:

- `demo-hearing-01.mp4` → served as `/videos/demo-hearing-01.mp4`
- `demo-hearing-02.mp4` → served as `/videos/demo-hearing-02.mp4`

Hearings in `data/hearings.ts` reference these paths via `videoSource.localAsset`.

Until files are present, the hearing room shows a graceful “Demo stream unavailable” placeholder instead of a broken player.
