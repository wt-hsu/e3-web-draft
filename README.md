# E3 Center — homepage draft

Static draft of the NTU E3 Research Center homepage. No build step, no
dependencies. Everything is one HTML file plus assets.

## Run it locally

```bash
node dev-server.mjs
```

Then open <http://localhost:3000>. Saving `index.html` reloads the browser
automatically, so you can keep your editor and the page side by side.

Any static server works if you would rather not use this one (for example
`python3 -m http.server`), but you lose the auto-reload and video scrubbing
needs byte-range support.

## Layout

```
index.html            the whole page: styles, markup, and page data
assets/img/           E3 and NTU logos (SVG)
assets/media/         hero video, WebM first then MP4 fallback
assets/fonts/         self-hosted IBM Plex, Geist, Space Grotesk
assets/vendor/        React and the canvas runtime, served locally
dev-server.mjs        dev server with live reload
```

## Editing the hero video

The hero is a wrapper div with a `<video>` inside it, near the top of `<body>`.

| What to change | Where | Notes |
| --- | --- | --- |
| Hero height | `height:800px` on the `.e3-hero` wrapper | The video always fills the wrapper. Phones use 560px. |
| Crop and horizontal framing | `width` in the `.e3-hero-video` rule | 100% means no crop. Higher crops more off the right and pushes the picture rightwards, away from the headline. Currently 118%. |
| Vertical framing | `object-position` in the same rule | With the box wider than the hero, the crop is vertical, so only the second value does anything. |
| How the video fills | `object-fit` in the same rule | `cover` crops to fill, `contain` letterboxes. |
| Overlay darkness | the two gradients on the `<section>` | A radial scrim lights the copy, a linear one grounds the floor. Lower the alpha values to show more video. |

The source video is 1280x720. The 118% crop means it is drawn about 1.33x its
native width on a 1440px screen, so a 1920x1080 master would look noticeably
sharper. Cropping harder costs more sharpness.

## Editing the content

All text lives in one place: the `renderVals()` method in the script block at
the bottom of `index.html`. Research areas, partners, news items, publications,
and footer links are plain arrays there. The markup above reads them through
`{{ }}` placeholders, so you rarely need to touch the HTML to change wording.

## The navigation menu

Three nav items drop a submenu on hover: Research, People, and News & Life.
Their links mirror the matching footer columns. About and Contact have no
submenu because the footer's "Center" column holds top-level pages rather than
children.

The markup is written out in the `<nav>` in the header, one `.e3-navitem` per
entry, so adding a link means adding an `<a>` inside that item's `.e3-submenu`.
Styling lives in the `.e3-submenu` rules in the stylesheet. Submenus open on
keyboard focus as well as hover.

The nav is hidden below 900px wide. There is no mobile menu yet.

## The hero eyebrows

The two small uppercase lines above the headline are `.e3-eyebrow` and
`.e3-eyebrow-strong` in the stylesheet. They sit above the design system's
11.5px label step because the hero headline is far larger than a section
heading, so the label needs more presence to hold its own.

Their tracking is wound back as the size goes up. Letter-spacing exists to
open up small type; keep the same em value on larger type and it reads loose
and runs too wide. If you change a size, move the tracking the other way.

Phones keep the original 11.5px and 14px, because the longer line wraps to
three lines otherwise.

The three E of "Energy, Economics, Environment" are marked with `.e3-e` to
show where the centre's name comes from. IBM Plex Mono is loaded at 400, 500
and 600 only, and the design system caps at 600, which the line already used,
so the E could not be made heavier. The emphasis comes from the rest of the
line easing back to 500 while the E holds 600 and lifts to pure white.

## Buttons and heading colour

Both hero CTAs share one `.e3-btn` rule, so they cannot drift apart. The rule
sets `box-sizing: border-box`; without it a bordered button renders 2px taller
than an unbordered one, because the page has no global box-sizing reset.

Section headings take their colour from a single `h2` rule in the stylesheet
(blue-800, `#204666`). Change it there rather than per heading.

On hover the buttons drop to a translucent fill so the footage reads through,
and the label flips from navy to white. That flip is required, not cosmetic:
navy on the translucent fill measures about 1.9:1, which is unreadable.

## Known gaps

- Image slots in the research cards and news items are empty.
- The fifth publication is a placeholder.
- Nav and footer links all point at `#`.
- No mobile navigation; the nav is hidden on narrow screens.
