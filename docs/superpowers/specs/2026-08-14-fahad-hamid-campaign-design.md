# Fahad Hamid Chauffeur Campaign Design

## Goal

Make Fahad Hamid the recognizable chauffeur face of Altaie's current product demonstration while preserving the site's restrained black-and-white editorial system, truthful private-beta disclosures, and existing interaction model.

## Selected Direction

Use a compact, identity-consistent campaign rather than a one-off avatar replacement. The existing user-provided photographs define Fahad's face, hair, beard, and physical build. Altaie's existing monochrome imagery defines the campaign treatment: tailored black suiting, pale Washington stone, black executive vehicles, controlled daylight, and quiet service gestures.

The campaign consists of four project assets:

1. A square formal portrait for chauffeur identity surfaces.
2. A wide Washington arrival image with Fahad and a black executive vehicle for the public homepage.
3. A landscape airport-service image for the booking experience and owner overview.
4. A landscape fleet-standard image for owner network views.

## Placement

- `/book`: replace Marcus Reed with `Fahad Hamid`, use Fahad's portrait, and use the airport-service campaign image for the Escalade service-class card.
- `/`: replace the anonymous hero background with the wide Fahad arrival campaign image; preserve all copy, overlays, and calls to action.
- `/owner`: replace Marcus driver records with Fahad Hamid and use the new airport/fleet campaign images in the hero and network showcase.
- `/portal`: identify Fahad on the upcoming movement and use his portrait on mobile and desktop ride-detail cards.
- Keep other named demo chauffeurs and all rider identities unchanged.

## Visual Rules

- Monochrome only in final presentation.
- A premium low taper fade with a crisp natural lineup and controlled short texture; no artificial painted-on hairline.
- Bespoke black high-twist wool suit, white spread-collar shirt, matte black tie, clean drape, and relaxed upright service posture; no visible logos, text, watermarks, watches used as product focus, or fashion branding.
- Fahad's identity must remain consistent across every image: facial proportions, beard, eyebrows, short dark hair, skin tone, and athletic build.
- Vehicles remain unbranded black executive sedans/SUVs; avoid impossible model details or license-plate text.
- Scenes must read as professional chauffeured transportation in Washington, not celebrity security, nightlife, private-jet ownership, or influencer content.
- Preserve Altaie's existing page layout, spacing, typography, navigation, and product copy unless a name or image reference must change.

## Content Integrity

The booking flow remains explicitly simulated. No generated image or copy may imply that a real chauffeur has been dispatched, that Altaie owns the displayed fleet, or that the demo itinerary is a confirmed reservation.

## Acceptance Criteria

- `Fahad Hamid` appears on all former Marcus chauffeur surfaces; `Marcus Reed` and `Marcus T.` no longer appear as chauffeurs.
- The homepage, booking flow, owner overview, and owner network render the new campaign assets without distortion or low-resolution cropping.
- The live-trip demo still advances through its existing states and retains all private-beta disclosures.
- Desktop and mobile browser checks show no layout regressions, missing images, console errors, or failed asset requests.
- `npm run check` passes and `design-qa.md` ends with `final result: passed`.
