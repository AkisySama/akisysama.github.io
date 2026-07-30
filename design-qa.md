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

---

# Design QA — Rainy Pixel Girl Intro

Source visual truth: `/Users/akisy/Pictures/790af22c-faf6-450a-a869-61e041dab2ff.png`

Project assets:

- `/Users/akisy/Downloads/Projects/blog/public/audio/rain-window-loop.m4a`
- `/Users/akisy/Downloads/Projects/blog/public/fonts/PressStart2P-Regular.ttf`
- `/Users/akisy/Downloads/Projects/blog/public/images/intro/rain-clock-device.webp`
- `/Users/akisy/Downloads/Projects/blog/public/images/intro/pixel-room-side-open.webp`
- `/Users/akisy/Downloads/Projects/blog/public/images/intro/pixel-room-side-enter.webp`
- `/Users/akisy/Downloads/Projects/blog/public/images/intro/pixel-room-side-blink.webp`

Browser-rendered implementation screenshots:

- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-rain-desktop.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-larger-rain.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-heavier-rain-16fps.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-rain-mobile.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-rain-blink.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-entry-desktop-idle.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-entry-fixed-initial.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-entry-fixed-returned.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-entry-no-triangle.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-entry-mobile.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-clock-sound-wait.jpg`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-clock-sound-on.jpg`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-clock-sound-1440x900.jpg`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-clock-sound-1440x900-on.jpg`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-clock-sound-1280x1024.jpg`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-clock-sound-mobile.jpg`

Combined comparison evidence:

- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-rain-comparison-desktop.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-rain-comparison-mobile.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/pixel-intro-rain-eye-comparison.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/rain-mask-before-after.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/rain-size-before-after.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/rain-16fps-sequence.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-entry-full-comparison.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-entry-focused-comparison.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-entry-before-after.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-enter-label-comparison.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/laptop-entry-no-triangle-comparison.png`
- `/Users/akisy/Downloads/Projects/blog/design-qa-assets/rain-clock-control-comparison.jpg`

Viewport and normalization: the 1672 × 941 source was normalized to the same `cover` crop as the implementation. Desktop evidence covers 1280 × 720, 1440 × 900, and 1280 × 1024 CSS pixels; intermediate landscape ratios use the production `98% center` crop so the physical clock remains fully visible. Mobile evidence is 390 × 844 CSS pixels with the production `43% center` subject crop and a source-derived clock fallback.

State: homepage intro in dark mode. The full-view evidence shows the open-eye idle state with active rain; the focused evidence compares browser-rendered open and closed eye states plus the rain-sound waiting and playing states.

## Findings

- No actionable P0, P1, or P2 differences remain.
- The supplied room artwork remains lossless except for the requested laptop-screen copy change. Character pose, crop, skyline, moon, cat, furniture, palette, and pixel grid remain unchanged.
- Rain is visible throughout the three glass panes with larger, more legible pixel streaks and does not cross the window frames, foreground girl, cat, clock, shelf, or sill.
- The reported indoor-rain defect is resolved: glass inclusion and foreground erasure now use separate paths, so character and cat silhouettes outside the panes can no longer become drawable rain islands.
- The generated closed-eye edit is confined to one small transparent eye patch. The focused browser comparison shows no full-scene flicker, face shift, blur, or visible compositing seam.
- The separate center-screen entry card has been removed. The laptop’s original `PLAY` label is replaced by exact rasterized `进入` copy, and the requested play triangle is cleanly removed while the timer, bezel, and perspective-matched semantic hit area remain intact.
- The original right-side alarm clock now functions as the rain-sound control. Its old `23:32` display is fully covered by an inset pixel screen that reads `RAIN: TAP`, `RAIN: ON`, or `RAIN: OFF`, preserving the original bezel, shelf contact, and blue glow.
- P3: the signature and input hint are intentional overlays absent from the source. Their low-contrast treatment stays subordinate to the artwork.

## Required Fidelity Surfaces

- Fonts and typography: the compact signature and responsive instruction hint use the existing monospace token. The clock display uses a locally bundled Press Start 2P face with a restrained cyan pixel glow. `进入` is rendered through a CJK typeface at a tiny logical size and restamped as crisp 2 × 2 image pixels; it is baked into the scene instead of floating above it as HTML.
- Spacing and layout rhythm: desktop is a full-bleed cover crop. A source-coordinate layer maps the 1672 × 941 artwork into the responsive crop, keeping both the laptop and clock hit areas aligned. Intermediate landscape ratios bias the artwork to `98% center`, keeping the full physical clock on-screen at 5:4 and 16:10. At 390 × 844, `object-position: 43% center` keeps the face, folded arms, knees, and a rain-filled window in view; the off-crop laptop is hidden and a 116 × 64px crop of the real clock sits at bottom-right above the swipe hint.
- Colors and visual tokens: the lossless source palette is unchanged. Rain uses restrained blue/cyan values with screen blending, so it reads on the dark glass without washing out the city.
- Image quality and asset fidelity: the open frame is a lossless WebP of the supplied 1672 × 941 image. The blink layer is a 1672 × 941 lossless WebP with alpha and only a compact eye-region payload. Artwork, rain canvas, and blink layer share the same source dimensions, `object-fit`, object position, transform, and pixelated rendering.
- Copy and content: visible app-specific copy is limited to `AKISY`, `NIGHT SIGNAL / 01`, the clock states `RAIN: TAP · ON · OFF`, `CLICK SCREEN · SCROLL DOWN`, and the mobile `SWIPE UP · ENTER`. The laptop reads `进入 / 00:00`, and both controls retain descriptive accessible names.

## Interaction, Accessibility, and Runtime Checks

- Rain advances at 16fps: a 520ms live sample advanced eight frames. Streaks vary from 16–32 source pixels long and 3–4 pixels wide, producing a more continuous heavy-rain motion while retaining visible pixel steps and no CSS interpolation.
- Rain uses a fixed 1672 × 941 canvas, a source-coordinate glass clip, and a separate `destination-out` foreground mask. It pauses when the intro is fully offscreen or the tab is hidden, then resumes when visible.
- The soundtrack is processed from the user-supplied 104MB recording in the project root. The first stable section begins at 125 seconds, bypassing the near-silent opening and long fade-in. A 120-second stereo AAC loop at 44.1kHz uses a four-second cosine/sine equal-power crossfade and compresses to 1.91MB without replacing or modifying the source file.
- Browsers that block autoplay keep the visible control in `RAIN / TAP`; the first trusted pointer or keyboard gesture starts playback synchronously. The explicit toggle then reports `RAIN / ON` or `RAIN / OFF`, updates `aria-pressed`, and changes its accessible label.
- Audio fades to a restrained 0.228 target volume (40% below the previous 0.38 default), pauses once less than 18% of the intro remains visible or the tab is hidden, and resumes only when the intro returns and the visitor has not switched it off. Leaving and returning through the laptop entry path was verified at `scrollY: 720` and `scrollY: 0`.
- At 1440 × 900 the clock control maps to a 137.7 × 76.5px source-aligned target at `(1290.1, 394.0)` with a 12px right margin. At 1280 × 1024 it remains fully visible with its right edge at `1273.4px`; at 390 × 844 the 116 × 64px real-clock fallback introduces no horizontal overflow.
- At 16fps, a 500ms offscreen sample advanced zero frames; after returning to the intro, the next 500ms advanced eight frames. Entry scrolling remained exact at `scrollY: 900`, and the scene stayed at `filter: none`.
- Blinking is a single binary open/closed frame switch: the closed frame holds for 165ms, the first automatic blink waits 5–8 seconds, and later blinks rest for a randomized 9–15 seconds. Consecutive double blinks are disabled.
- A 26.5-second live browser sample captured closed states at 7.04s and 18.57s, an 11.53-second gap, with exactly one reopen after each blink and no console errors or warnings.
- The background scene remains non-interactive and no longer triggers blinking when clicked or tapped. The laptop’s inner display is the only pointer entry target; downward wheel, upward swipe, Arrow Down, Page Down, Space, and Enter remain available.
- At 1440 × 900, the laptop button maps to a 168.4 × 112.9px bounding box at `(1122.7, 630.3)` and uses a clipped quadrilateral matching the display perspective. Clicking it set `data-blog-entered="true"` and scrolled exactly to `scrollY: 900`.
- The scene explicitly declares the default cursor; only the laptop display reports `cursor: pointer`. Keyboard focus uses the same clipped shape with a restrained blue outline and glow.
- Clicking the laptop no longer adds a scene-wide filter or scale, so the opening artwork stays at `filter: none` and full brightness throughout the scroll.
- After a visitor scrolls manually back to `scrollY: 0`, the laptop remains `pointer-events: auto`; a second click was verified to scroll back to `scrollY: 900`.
- At 390 × 844, the off-crop laptop target is `display: none`, the compact `SWIPE UP · ENTER` hint is visible, document width remains 390px, and pressing Enter set the entered state and scrolled exactly to `scrollY: 844`.
- Entry listeners remain available for repeat entry while the homepage is mounted. Their wheel threshold prevents them from consuming blog input, and all listeners, timers, animation frames, media-query listeners, visibility listeners, and the intersection observer are cleaned up on Astro page swaps.
- Reduced-motion mode keeps one static rain frame, disables automatic blinking, removes reveal transforms, and uses immediate entry scrolling.
- A refresh from a previously scrolled homepage was verified to return to `scrollY: 0`, restoring the intro instead of the prior scroll position.
- The open frame has descriptive alternative text; the canvas and blink-only frame are hidden from assistive technology. The entry button is semantic and keyboard accessible.
- Mobile document width equals the 390px viewport with no horizontal overflow. Browser console inspection reported zero errors or warnings.

## Full-view Comparison Evidence

`pixel-intro-rain-comparison-desktop.png` places the normalized source and 1440 × 900 browser implementation in one image. Their source-image composition is pixel-aligned; only rain and the intentional entry chrome differ.

`pixel-intro-rain-comparison-mobile.png` places the normalized source crop and 390 × 844 browser implementation together. The crop and subject scale match, with no face, knee, button, or horizontal-overflow defect.

`laptop-entry-full-comparison.png` places the normalized 1440 × 900 source and revised implementation together. The previous floating entry card is gone; the laptop, character, skyline, furniture, and crop stay pixel-aligned.

## Focused Region Comparison Evidence

`pixel-intro-rain-eye-comparison.png` places browser-rendered open and closed face crops side by side at 2× nearest-neighbor scale. Only the eye region changes; the hair edge, nose silhouette, face shading, window, and adjacent city pixels stay stable.

`rain-mask-before-after.png` places five-frame motion heatmaps before and after the mask fix side by side. The initial heatmap exposes animated rain on the girl, cat, and bed; the corrected heatmap confines all motion to the three glass panes.

`rain-size-before-after.png` places equal 770 × 640 window crops before and after the rain-size adjustment side by side. The revised streaks are visibly longer and thicker without increasing drop count or obscuring the skyline.

`rain-16fps-sequence.png` places four equal window crops captured 90ms apart in one strip. The rain advances in every frame, reads as a continuous downpour, and remains clipped to the glass throughout the sequence.

`laptop-entry-no-triangle-comparison.png` enlarges the edited source and live implementation laptop regions side by side. The `进入` glyph pixels, cleaned screen texture, timer, bezel, and surrounding bedding align without a triangle remnant or HTML-overlay seam.

`rain-clock-control-comparison.jpg` places the original `23:32` clock, browser-rendered `RAIN: TAP`, and active `RAIN: ON` states side by side. The bezel, shelf contact, blue falloff, and perspective remain continuous; the replacement screen fully hides the old digits and uses crisp pixel text.

## Comparison History

1. The first rain pass matched the artwork but used broad rectangular pane masks. The masks were tightened to the inner glass edges, given sloped top boundaries, notched around the right-side clock and shelf, and punched around detailed girl and cat silhouettes.
2. The initial blink asset changed small color values across the full image. It was reduced to a 9KB alpha overlay containing only the Image Gen closed-eye patch, eliminating full-frame flicker.
3. The first lifecycle pass left entry input listeners and the rain loop active after leaving the intro. Entry listeners now abort immediately, and rain is visibility- and intersection-aware.
4. Refresh testing from a scrolled homepage exposed late browser scroll restoration and home-only listeners surviving client navigation. The handlers now inspect the current page/entered state and unregister on Astro swaps; the post-fix browser check returned to `scrollY: 0`.
5. Final desktop, mobile, open-eye, closed-eye, rain cadence, entry-boundary, offscreen-pause, overflow, and console checks passed with no actionable P0/P1/P2 findings.
6. A follow-up five-frame motion heatmap exposed an even-odd topology error: the portions of the girl and cat outside the glass became drawable islands. The panes and foreground silhouettes were split into independent clip/erase paths; post-fix desktop and mobile captures show rain only on glass.
7. Automatic blinking was reduced to one blink every 9–15 seconds after a 5–8 second initial wait. The optional double-blink branch was removed while preserving the 165ms pixel-frame hold.
8. Scene-wide pointer handling and its hand cursor were removed. Clicking the artwork now has no effect on blink timing; the explicit entry button remains interactive.
9. The previous center-bottom entry card competed with the laptop already displaying `PLAY`. It was removed and replaced with a source-coordinate semantic button clipped to the laptop’s inner-screen quadrilateral. Post-fix full-view and focused comparisons show no idle visual drift, while live interaction testing confirms the laptop screen enters the blog.
10. Follow-up testing exposed an irreversible entry state: the first click dimmed the scene, removed input listeners, and made the laptop unusable after returning to the intro. The one-shot state and dimming selectors were removed, `进入` was baked into the screen as pixel text, and two consecutive enter cycles now complete at full brightness.
11. The play triangle below `进入` was removed from the raster itself. Clean screen pixels were interpolated across the icon bounds, preserving the screen’s blue falloff; the focused source/implementation comparison shows no residual icon or flat repair patch.
12. Rain streaks were enlarged from 10–22 × 2–3 source pixels to 16–32 × 3–4 pixels. The same 104-drop count, 8fps cadence, glass clipping, and foreground erasure keep the result readable and confined outdoors.
13. The rain cadence was increased from 8fps to 16fps for a more natural heavy downpour. A 520ms runtime sample advanced eight frames, and the four-frame visual sequence confirms continuous outdoor motion without changing blink timing or mask geometry.
14. A low-volume, thunder-free synthetic loop and compact top-right control were initially added to validate the lifecycle. Autoplay fallback, explicit on/off, offscreen fade-out, return-to-intro resume, and Astro cleanup passed live checks.
15. The synthetic loop was replaced with the user’s 104MB recording, trimmed to its stable rain bed and exported as a two-minute equal-power loop. The floating control moved onto the source artwork’s alarm clock, with bundled pixel typography and a real-clock mobile fallback. Desktop, 5:4, mobile, repeated-entry, pause/resume, overflow, and side-by-side fidelity checks all passed.

## Implementation Checklist

- [x] Exact supplied side-facing scene bundled losslessly
- [x] Eye-only generated blink layer
- [x] Continuous 16fps pixel rain
- [x] Seamless thunder-free rain soundtrack
- [x] User recording trimmed, equal-power looped, and browser-optimized
- [x] Autoplay fallback and explicit accessible sound control
- [x] Source-aligned alarm-clock control with pixel typography
- [x] Offscreen, hidden-tab, and page-swap audio lifecycle
- [x] Larger 16–32 × 3–4px rain streaks
- [x] Window, character, cat, clock, shelf, and sill masking
- [x] Infrequent single low-frame-rate blink
- [x] Non-interactive scene background
- [x] Perspective-aligned laptop screen entry
- [x] Pixel-raster `进入` laptop label
- [x] Play triangle removed without a visible screen patch
- [x] Full-brightness, repeatable laptop entry
- [x] Wheel, touch, and keyboard entry fallbacks
- [x] Reduced-motion and offscreen pause behavior
- [x] Astro transition cleanup and refresh scroll reset
- [x] Desktop and mobile responsive crops
- [x] Accessible labels and semantic entry control
- [x] Browser console, overflow, runtime, and side-by-side visual checks

final result: passed
