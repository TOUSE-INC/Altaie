# Altaie Option 2 Design QA

## Comparison target

- Source visual truth: `docs/design-qa/option-2-reference.webp`
- Browser-rendered implementation: `docs/design-qa/implementation-final.jpg`
- Combined full-view comparison: `docs/design-qa/option-2-comparison.jpg`
- Focused typography/timeline comparison: `docs/design-qa/focus-top-final.jpg`
- Focused manifest/assignment comparison: `docs/design-qa/focus-assignment-final.jpg`
- Route/state: `/book`, assigned demo itinerary
- Theme: warm ivory, black editorial treatment
- Browser CSS viewport: 1363 × 936 px; full-page capture: 1348 × 2811 px (the screenshot excludes the 15 px scrollbar)
- Source pixels: 853 × 1844 px
- Density normalization: source scaled to the implementation's 980 px content frame and centered on a 1348 px canvas; the first 2120 px of both artifacts were compared at equal pixel dimensions. The original-resolution source and implementation were also opened before judgment.

## Findings

- No actionable P0, P1, or P2 differences remain.
- Fonts and typography: Newsreader and Manrope reproduce the source's editorial serif display and compact uppercase utility copy. The selected assigned-state headline now preserves the source's intentional two-line break, optical weight, and hierarchy.
- Spacing and layout rhythm: header, disclosure, milestone hero, six-stage timeline, route map, manifest, assignment, and CTA stack preserve the source order and proportions. Minor density differences at the wider browser viewport are expected responsive behavior and do not change hierarchy.
- Colors and visual tokens: warm ivory paper, black ink, restrained gray rules, muted metadata, and monochrome imagery match the source. No unintended gradients, rounded-card drift, or decorative effects were introduced.
- Image quality and asset fidelity: the browser renders a local high-resolution Washington route map, a real chauffeur portrait, and a dedicated studio Escalade asset. The selected vehicle asset now matches the source's isolated editorial treatment and direction. All UI icons use Phosphor; no placeholder drawings or handcrafted SVG assets are present.
- Copy and content: the selected itinerary details match the reference. Added demo/private-beta disclosures, request CTA, and fleet extension are intentional product-safety and scope additions beneath the selected screen rather than visual substitutions.
- Accessibility: controls are semantic buttons/links, the timeline exposes `aria-current`, the map and images have descriptive labels, focus-visible treatment is present, reduced motion is supported, and the mobile breakpoint preserves usable tap targets.

## Comparison history

1. Initial browser pass — blocked.
   - Earlier finding: P1 route map failure; the remote tile layer rendered as a blank gray surface in the cloud browser.
   - Fix: replaced the remote dependency with a generated, local high-resolution Washington route asset and a state-aware Phosphor vehicle marker.
   - Post-fix evidence: the map loaded in the browser, exposed a nonzero natural width, and remained visible in itinerary and live-trip states.

2. First side-by-side pass — blocked.
   - Earlier findings: P2 timeline-state mismatch and P2 vehicle-art mismatch. Completed steps were outlined rather than filled, the current step used a check instead of a solid dot, and the assignment used an environmental chauffeur photo rather than the source's isolated SUV.
   - Fixes: aligned completed/current/pending timeline icon states and generated a dedicated ivory-background Escalade studio asset.
   - Post-fix evidence: `docs/design-qa/focus-top-final.jpg` and `docs/design-qa/focus-assignment-final.jpg`.

3. Second side-by-side pass — blocked.
   - Earlier findings: P2 assigned-headline wrap and P2 above-the-fold density drift.
   - Fixes: preserved the selected headline's semantic two-line break, increased hero/timeline breathing room, and enlarged/flipped the vehicle treatment to match the source composition.
   - Post-fix evidence: `docs/design-qa/option-2-comparison.jpg`; no actionable P0/P1/P2 difference remains.

## Fahad Hamid campaign extension

- Final campaign set: `public/images/chauffeurs/fahad-hamid-portrait.webp`, `fahad-hamid-arrival.webp`, `fahad-hamid-airport.webp`, and `fahad-hamid-fleet.webp`.
- Asset review evidence: `docs/design-qa/fahad-campaign-contact-sheet.jpg`.
- In-context evidence: `docs/design-qa/fahad-campaign-home.jpg`, `docs/design-qa/fahad-campaign-book.jpg`, `docs/design-qa/fahad-campaign-arrival-comparison.jpg`, and `docs/design-qa/fahad-campaign-portrait-comparison.jpg`.
- Hair and grooming: the four-image set consistently uses a premium low taper, natural lineup, controlled short texture, and a shaped full beard without an artificial painted-on edge.
- Wardrobe: the suit reads as bespoke black high-twist wool with a clean shoulder line, restrained lapels, white spread collar, and centered matte black tie. No logos, watermarks, or fashion branding are visible.
- Posture and service cues: Fahad stands upright with relaxed shoulders and open hands, holds vehicle doors without crowding the passenger zone, and reads as a polished chauffeur rather than security detail.
- Homepage placement: the wide arrival image preserves the source's left-side negative space for the editorial headline and keeps Fahad and the sedan clear beneath the existing monochrome overlay.
- Booking placement: the square portrait remains recognizable at the 116 px circular assignment crop; the haircut, collar, tie, and shoulder line remain legible without crowding the name or actions.
- Product continuity: Fahad replaces only the former demo chauffeur identity across `/book`, `/owner`, and `/portal`; rider identities and other demo chauffeurs remain unchanged.
- Core browser flow: verified assigned itinerary, live-trip transition, ETA advance from 20 to 12 minutes, and coordination-desk panel open/close at a 1363 × 936 CSS viewport.
- Diagnostics: no application-origin console errors were observed. The only logged errors came from the cloud browser's `chrome-extension://` metadata helper and are classified as environment noise.
- Remaining P0/P1/P2 findings: none.

## Primary interactions tested

- Changed the six-stage itinerary from Assigned to En route and verified the headline and `aria-current` state.
- Opened the trip menu and entered the live-trip view.
- Advanced the live demo to Complete and verified the live state.
- Opened and closed the coordination-desk panel.
- Entered the ride-request flow, filled mock pickup/destination values, returned to the itinerary, and restored Assigned.
- Checked browser console warnings/errors after the final flow; no application errors were present.

## Open questions

- None blocking. A dedicated mobile source visual would allow pixel-level mobile comparison; the current responsive behavior is an implementation extension of the selected desktop target.

## Implementation checklist

- [x] Selected visual recreated.
- [x] Local production-mode preview verified in the cloud browser.
- [x] Core itinerary, live trip, desk, and request interactions verified.
- [x] Browser console checked.
- [x] P0/P1/P2 findings fixed and compared again.

## Follow-up polish

- P3: if a future reference includes real map-label artwork, replace the intentionally simplified illustrative base map while keeping the current demo-data disclosure.

final result: passed
