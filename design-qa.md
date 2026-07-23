# Design QA — Digital Island Homepage Hero

Source visual truth: `/var/folders/mt/rshsz8nd0094xnfyrh1drl5c0000gn/T/codex-clipboard-2de064cd-a79f-4491-bdb3-520ffc035780.png`

Bundled source asset: `/Users/akisy/Downloads/Projects/blog/public/images/digital-island-signal.webp`

Implementation screenshot: `/Users/akisy/Downloads/Projects/blog/design-qa-assets/digital-island-homepage-desktop.png`

Mobile screenshot: `/Users/akisy/Downloads/Projects/blog/design-qa-assets/digital-island-homepage-mobile.png`

Focused comparison: `/Users/akisy/Downloads/Projects/blog/design-qa-assets/digital-island-comparison.jpg`

Viewport: 1440 × 1000 desktop; responsive layout also checked at 390 × 844.

State: homepage after the intro sequence, dark theme. Light-theme rendering was checked separately.

## Findings

- No actionable P0, P1, or P2 findings remain.
- The supplied artwork keeps its original contour detail, signal nodes, negative space, and right-weighted composition.
- P3: the HTML caption is intentionally layered over the artwork rather than baked into the raster asset so it remains readable and accessible across themes.

## Required Fidelity Surfaces

- Fonts and typography: existing Cormorant-led hero typography remains unchanged. The new signal caption uses the established monospace token at 0.6rem with restrained tracking.
- Spacing and layout rhythm: the 2:1 artwork maps directly into the 56% hero track at desktop. Its built-in negative space preserves separation from the left copy. At mobile, the artwork fills the lower 330px of the hero without horizontal overflow.
- Colors and visual tokens: dark mode uses the original near-black and warm-gray artwork through a screen blend. Light mode reverses it through a multiply blend at reduced opacity, matching the existing warm paper palette.
- Image quality and asset fidelity: the exact supplied 1774 × 887 source is bundled as a 177KB WebP. No placeholder, CSS drawing, SVG recreation, or generated substitute is used. Fine contour lines remain legible at both tested breakpoints.
- Copy and content: the existing homepage title and introduction remain unchanged. The figure label and alt text now describe the digital-island signal map; the visible caption reads `SIGNAL FOUND / AKISY’S JOURNAL`.

## Interaction and Runtime Checks

- The island raster remains static so its fine contour lines stay crisp without transform resampling or visible jitter. Independent signal nodes pulse above it without moving the artwork.
- Dark-to-light theme switching preserves the image and caption with appropriate contrast.
- Desktop navigation and the theme toggle remain functional.
- At 390px, document width equals viewport width and the hero introduces no horizontal overflow.
- Browser console checks reported no errors or warnings in desktop and mobile states.
- `npm test` passes with zero Astro diagnostics and the theme contract now asserts the new source asset.

## Full-view Comparison Evidence

The desktop implementation screenshot shows the supplied island occupying the original portrait region without changing the surrounding header, hero copy, focus strip, editorial grid, or footer. The artwork's right-weighted hierarchy matches the source while the left-side signal path creates a visual bridge toward the hero copy.

## Focused Region Comparison Evidence

`digital-island-comparison.jpg` places the supplied raster source and rendered right-side hero region in the same image. The implementation preserves the contour structure, peak hierarchy, node positions, and negative space. The only intentional additions are the accessible HTML caption and theme-aware blending.

## Comparison History

1. Initial rendered comparison passed with no P0/P1/P2 differences.
2. Desktop dark, desktop light, and 390px mobile states were inspected; no corrective visual iteration was required.

## Implementation Checklist

- [x] Supplied source bundled and optimized
- [x] Old anime portrait reference replaced
- [x] Theme-aware dark and light treatment
- [x] Stable, jitter-free contour rendering
- [x] Randomized, reduced-motion-aware signal pulses
- [x] Responsive desktop and mobile crop
- [x] Accessible figure label and alt text
- [x] Automated tests and browser console checks
- [x] Focused side-by-side visual comparison

final result: passed

---

# Design QA — Animated Metro Interlude

Source visual truth: `/var/folders/mt/rshsz8nd0094xnfyrh1drl5c0000gn/T/TemporaryItems/NSIRD_screencaptureui_teOibE/Screenshot 2026-07-24 at 1.44.14 AM.png`

Generated source assets:

- `/Users/akisy/Downloads/Projects/blog/public/images/metro/subway-interior.png`
- `/Users/akisy/Downloads/Projects/blog/public/images/metro/city-panorama.png`
- `/Users/akisy/Downloads/Projects/blog/public/images/metro/girl-seated.png`

Implementation composition proof: `/Users/akisy/Downloads/Projects/blog/design-qa-assets/metro-composition.png`

Mobile composition proof: `/Users/akisy/Downloads/Projects/blog/design-qa-assets/metro-composition-mobile.png`

Focused comparison: `/Users/akisy/Downloads/Projects/blog/design-qa-assets/metro-reference-comparison.png`

Intended viewport/state: homepage after the intro sequence, dark theme; 1366 × 292 desktop scene and centered 390 × 230 mobile crop.

## Findings

- No visible P0, P1, or P2 issue remains in the layer composition proof.
- The generated subway interior preserves the reference's centered bench, wide window, hanging straps, symmetric doors, and restrained violet-gray palette.
- The city panorama fills the measured window aperture without stretching. Two copies move in a continuous loop, with a second light-cycle animation to make the view evolve over time.
- The seated character remains centered on the bench at both desktop and mobile widths.
- A restrained inset shadow restores the reference's dark vignette while leaving the pixel art legible.
- P3: the new girl faces forward instead of using the reference's three-quarter pose. This is an intentional asset variation rather than a layout defect.

## Interaction and Runtime Checks

- The motion control toggles the city and character animations together and updates its icon, label, `aria-label`, and `aria-pressed` state.
- Reduced-motion mode disables both animations and hides the redundant motion control.
- `npm test` passes with zero Astro diagnostics; the theme contract now asserts the metro component and its reduced-motion behavior.
- The local service responds with HTTP 200.
- Browser-based runtime inspection could not be completed because the configured in-app browser policy rejected access to the local preview and explicitly prohibited alternate browser workarounds. Console, live interaction, and true browser-layout screenshots therefore remain unverified.

## Comparison History

1. The initial static layer composite matched the source hierarchy but lacked its edge falloff.
2. A non-interactive inset vignette was added; the focused comparison then showed the intended wide-car composition, centered girl, and unobstructed animated window.
3. A 390px centered crop confirmed that the bench, girl, and full window remain readable on mobile.

## Implementation Checklist

- [x] Real raster interior, city, and character assets
- [x] Seamless city movement and evolving light treatment
- [x] Pixel-crisp rendering
- [x] Working pause/play control
- [x] Reduced-motion fallback
- [x] Desktop and mobile layer-composition checks
- [x] Automated tests
- [ ] Live in-app browser verification

final result: blocked
