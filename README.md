# ELYSIA

**Leave Your Mark. Build Your World.**

ELYSIA adds a persistent digital layer of creativity, memories and stories to real-world geography.

## Phase 1 — Footstep MVP

The first working slice includes:

- Interactive world map
- Pan and zoom across Earth
- Current-location map control (browser permission required)
- Tap/click any geographic point
- Create a Footstep with type, title and message
- Footstep markers and detail popups
- Browser persistence using localStorage
- Responsive mobile/desktop interface

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Next build milestone

Replace local-only storage with authentication + PostgreSQL/PostGIS APIs so Footsteps are persistent and shared between users. Then add location timelines, media uploads, likes, comments, saves, sharing, moderation and clustering.

## Product principle

> What has someone created here?

Earth → Country → City → Location → Footstep → Experience
