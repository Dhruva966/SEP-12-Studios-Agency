# SEP 12 Studios Agency

12 Studios is a UCLA student-run creative agency helping Westwood businesses reach students through content, in-person promotion, and websites.

Production: https://12studios.vercel.app

## Website

The site includes an animated landing page, high-quality creator videos, performance screenshots with an image viewer, five independently scrollable example websites, twelve team portraits, and a contact form with optional newsletter updates.

The example businesses are design concepts, not functioning booking services. Their inquiry forms download a draft. The tailoring concept currently uses a still photograph and animated gradient; no sewing video is supplied.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run build
npx serve public
node --test tests/*.test.mjs
```

Static preview does not run the contact API. Use `npx vercel dev` after connecting the Vercel project for full integration testing.

## Deploy to Vercel

Import this repository. Framework: Other. Build command: `npm run build`. Output directory: `public`. Connect a **private Vercel Blob store** to the project, which supplies `BLOB_STORE_ID` and uses Vercel’s project identity, and redeploy.

The build assembles original-quality video chunks into `/media/*.mp4`; Vercel serves those files with native streaming/range support. The source chunks also support the optional Cloudflare Worker deployment.

## Contact form

`api/subscribe.js` adapts the shared handler in `cloudflare-worker.js` to Vercel and private Blob storage. Email and the optional message are saved privately. Newsletter consent is recorded separately; opting out does not prevent an inquiry. The email notification destination is `vutukurydhruva@ucla.edu` via FormSubmit. That inbox must activate FormSubmit before notification delivery can be relied on. Notification failures do not discard stored inquiries. Identical accepted submissions are deduplicated.

No credentials belong in Git. Configure secrets in the hosting dashboard. Private inquiry exports, local runtime files, deployment credentials, and generated build output are excluded.

## Editing

- `index.html`, `style.css`, `app.js`: main page, styling, and interactions.
- `config.js`: team names, years, portrait framing, and media settings.
- `assets/team/`: all twelve supplied portraits.
- `demos/`: restaurant, tailoring, dry cleaning, salon, and auto-care concepts, each with its own HTML/CSS/JS.
- `opening.js`: opening animation, respecting reduced-motion preferences.
- `tests/`: contact validation, consent, storage, notification behavior, and video byte-range tests.
- `scripts/build.mjs`: reproducible static production build.

## Collaboration

Clone the repository, create a branch, make changes, run the build and tests, and open a pull request against the production branch, `Dhruvasprojects`. Public access allows anyone to read the project; write collaborators can be invited through repository settings.

## Media and affiliation

Portraits and creator screenshots were supplied for this site. Their inclusion does not grant unrestricted reuse. Performance figures describe the creator's channels, not guaranteed client results. The agency is independent and is not affiliated with or endorsed by UCLA. No open-source license is granted by this repository.
