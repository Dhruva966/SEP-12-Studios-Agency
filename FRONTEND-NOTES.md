# Frontend implementation notes

## Current direction — October 8, 2026

Lead with reaching UCLA students through online content and in-person promotion; website design is a visible supporting service. Homepage sequence: offer/services and reporting, videos/performance, website examples, team, contact. Separate studio biography and long process/promise sections were removed to reduce repetition.

Retained the cream/cobalt visual system, original phoenix logo on cream, larger 12 STUDIOS text, Manrope body copy, clean SVG arrows, Anime.js, and the WebGL reveal. The opening shader uses an opaque-or-clear reveal rather than a translucent blue overlay.

Services name social posts, creator-style videos, posters, promotional boards, face-to-face outreach, and website design. Reporting copy mentions campaign links, traffic, and inquiries/purchases where tracking is configured. This describes the service offer; there is no fabricated live customer dashboard or guaranteed sales claim.

## Website concepts

The five examples retain their existing native navigation, service controls, settings, motion controls, and inquiry workflows. Layout changes distinguish the industries:

- Restaurant: split photographic hero, warm menu presentation, squared ticket-like actions.
- Tailoring: centered masthead, editorial asymmetry, serif display type, understated links, vertical fitting sequence.
- Dry cleaning: practical service/price layout and clear pickup-oriented actions. Example prices are explicitly illustrative.
- Salon: image-led editorial hero and staggered lookbook.
- Auto care: bold typography, strong contrast, estimate-focused layout.

Each embedded iframe scrolls independently, and each card links to its full page. All titles remain 12 Studios. These are concepts, not client case studies. Preserve the visible form notices: saving an inquiry downloads a file, and a configured email action opens a draft rather than confirming a booking.

## Evidence and team

Three headline figures come from supplied screenshots: 3.1M Instagram views in a displayed 30-day window, 1.8M on one Instagram reel, and 1.3M on one TikTok post. They are creator-channel results, not client-sales evidence, and are not summed. The adjacent text identifies the creator context. Ten screenshots are arranged in a two-row pinboard and open in a native dialog with a full-size view.

Eight named portraits are configured; four slots remain placeholders pending user assets. Captions use UCLA ’2030 except Ryan Kunkel and Ewan Wong, UCLA ’2029. No majors or invented job titles.

## Functional constraints

- Keep full-video byte-range routing intact; static-only previews cannot test it.
- Video cards autoplay muted when visible and motion is allowed. Full films open with controls and sound on explicit interaction.
- Both image and video dialogs lock background scrolling and restore position/focus when closed, including on mobile.
- Preserve accessible button names when removing visible captions. Navigation closes on selection, outside click, or Escape.
- Root motion, signup, channel, and video initialization tolerate absent optional sections.
- Sticky-header anchor offsets and narrow-screen logo sizing are explicitly overridden near the end of the stylesheet.
- Main conversion is a direct email draft; optional newsletter storage is separate. FormSubmit activation/inbox delivery remains unverified. See README for hosting and storage limitations.

## Verification

Independent static review checked the root and all five demos: no duplicate IDs, unresolved internal anchor links, or missing directly referenced local image/script/style/iframe assets. JavaScript syntax checks passed. Nine existing automated tests cover signup validation, origin/body guards, storage failures, notification states, and media ranges across chunks.

Browser interaction and visual QA are performed separately at desktop and phone widths. Do not treat these static checks as proof that every browser behavior has been tested. Recheck gallery controls, iframe navigation, full-film playback, image zoom/close, mobile navigation, email action, and newsletter feedback after material changes.
