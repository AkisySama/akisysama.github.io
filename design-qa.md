# Design QA: Astro Neumorphic Anime Theme

source visual truth path: `docs/superpowers/specs/2026-06-21-astro-neumorphic-anime-theme-reference.png`

implementation screenshot path: `tmp/theme-qa/home-desktop-v3.png`

viewport: desktop `1440x1024`; mobile spot-check `390x844`

state: homepage default state, no hover or menu state

full-view comparison evidence: `tmp/theme-qa/comparison-desktop-v2.png`

focused region comparison evidence: `tmp/theme-qa/comparison-focus.png`

additional evidence:

- `tmp/theme-qa/home-mobile-viewport.png`
- `tmp/theme-qa/posts-desktop-v2.png`
- `tmp/theme-qa/tags-desktop-viewport.png`
- `tmp/theme-qa/about-desktop-viewport.png`
- `tmp/theme-qa/post-desktop-viewport.png`

## Findings

- No actionable P0/P1/P2 findings remain.

## Fidelity Surfaces

Fonts and typography:

- The implementation uses the existing system UI stack, which is close to the selected mock's clean product typography.
- Heading scale, weight, and hierarchy match the mock closely enough for the real content. Long Chinese titles wrap correctly on cards and article pages.
- Body copy remains readable on desktop and mobile. Mobile first viewport shows no clipped text.

Spacing and layout rhythm:

- Header, hero, image showcase, latest posts, tag sidebar, and footer follow the selected composition.
- The implementation uses real migrated content, so the latest-post section differs from the generated mock where some latest posts have no cover image.
- A P2 layout issue was found and fixed: no-cover post cards in the posts index originally collapsed into a narrow grid column. Cards now use `post-card-no-cover` and span correctly.
- A P2 polish issue was found and fixed: homepage excerpts were too tall and made the latest-post section heavier than the mock. Homepage card excerpts are now clamped to 5 lines.

Colors and visual tokens:

- The page uses cool mist-white surfaces, soft gray shadows, and subdued blue-gray accents.
- Small icons and UI chrome use the light-gray icon system rather than saturated colors.
- Active navigation uses pressed surfaces instead of bright color.

Image quality and asset fidelity:

- The large homepage anime showcase uses `/images/background.jpeg`, preserving vivid color and making the image the dominant saturated element.
- Existing article cover images remain vivid and are not affected by global filters.
- Icons come from `@lucide/astro`; no handcrafted SVG, CSS art, emoji, or text-symbol substitutes are used for visible UI icons.

Copy and content:

- Site navigation, homepage hero copy, article cards, tags, and footer use real project content.
- No placeholder copy is visible.

## Patches Made Since Previous QA Pass

- Replaced the old Astro view-transition API name with `ClientRouter`, matching Astro 6.4.8.
- Added a `post-card-no-cover` class and CSS rule so text-only posts fill their card layout.
- Clamped homepage post excerpts to 5 lines to keep the homepage rhythm closer to the visual target.
- Converted the header's right-side circular icon from decorative chrome into an accessible link to `/about/`.

## Implementation Checklist

- Header uses neumorphic shell and active nav state.
- Homepage uses two-column hero and large anime showcase.
- Stats, links, tags, dates, and footer controls use muted Lucide icons.
- Latest posts and hot tags render from existing content.
- Posts, tags, about, and post detail pages share the new visual system.
- Desktop and mobile screenshots show no horizontal overflow.

## Follow-up Polish

- P3: If the user wants the homepage to match the mock more tightly, choose featured posts with cover images for the homepage while keeping the posts index chronological.
- P3: Add a real RSS/feed route before turning the footer controls into a feed link.

final result: passed
