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
show where the centre's name comes from.

The letter is already white and already at 600, the heaviest weight loaded for
IBM Plex Mono and the design system's ceiling, so it cannot be pushed further
on its own. The separation comes from the other side: the rest of the line
sits at blue-300 rather than blue-200, which roughly doubles the brightness
step from the E to its neighbours. Size only has to nudge, one step up the
ladder from 16px to 17px.

Blue-300 is the dimmest step that still clears WCAG AA over the footage,
measuring 6.05:1 against the brightest frame. Anything dimmer fails, so treat
that as the floor if you retune this line.

## Buttons and heading colour

Both hero CTAs share one `.e3-btn` rule, so they cannot drift apart. The rule
sets `box-sizing: border-box`; without it a bordered button renders 2px taller
than an unbordered one, because the page has no global box-sizing reset.

Section headings take their colour from a single `h2` rule in the stylesheet
(blue-800, `#204666`). Change it there rather than per heading.

On hover the buttons drop to a translucent fill so the footage reads through,
and the label flips from navy to white. That flip is required, not cosmetic:
navy on the translucent fill measures about 1.9:1, which is unreadable.

## Hover motion standard

Every element that answers a pointer draws on one set of tokens, so no new
motion has to be designed per component. The tokens and patterns live in one
commented block near the top of the stylesheet.

| Token | Value | For |
| --- | --- | --- |
| `--e3-dur-tint` | 120ms | colour, border, background |
| `--e3-dur-move` | 180ms | a control shifting position |
| `--e3-dur-open` | 320ms | disclosure: reveals, media zoom |
| `--e3-ease` | `cubic-bezier(.2,0,0,1)` | all of them |
| `--e3-lift` | 1px | how far a button rises |
| `--e3-float` | 3px | how far a title lifts |
| `--e3-slide` | 4px | how far an arrow travels |
| `--e3-dur-enter` | 560ms | a card rising into view |
| `--e3-rise` | 16px | how far it rises from |
| `--e3-stagger` | 70ms | delay between siblings |

The patterns, applied by class:

| Class | Behaviour |
| --- | --- |
| `.e3-btn` | Solid button on a dark ground. Tints, rises 1px, returns on press. |
| `.e3-btn-solid` | Same motion on a light ground. |
| `.e3-rowlink` | A whole article row. Wrap any news or publication link in it. |
| `.e3-float` | The title inside a row link. Lifts 3px off its baseline. |
| `.e3-media` | The image frame inside a row link. Eases in to 1.03. |
| `.e3-arrowlink` | A text link ending in an arrow; the arrow slides right. |
| `.e3-reveal` | A research card; the description opens. |
| `.e3-footlink` | Footer link, colour only. |
| `.e3-rise` | Rises into place the first time it is scrolled to. |

Three rules hold the standard together:

- **Only transform, opacity and colour animate.** Those are what the browser
  can carry without re-laying out the page. Animating width, height, top or
  left stutters on a long page.
- **Every pattern answers `:focus-visible` as well as `:hover`,** so the
  keyboard sees what the mouse sees.
- **Under `prefers-reduced-motion` the movement stops and the colour change
  stays,** so nothing silently loses its affordance.

To add a new hoverable thing, reach for the nearest class. If none fits, build
it from the tokens rather than inventing a duration or a curve.

### The scroll reveal

`.e3-rise` is driven by an `IntersectionObserver` set up in `revealOnScroll()`,
called from the component's `componentDidMount`. Three details in there are
load-bearing:

- **The hidden state is armed by a `js` class** the observer adds once the
  markup exists. Nothing is `opacity: 0` in the markup itself, so the page can
  never get stuck invisible if scripting or the runtime fails.
- **The observer's `rootMargin` runs far above the viewport.** Without that, an
  element jumped past in a single frame (an anchor link, the End key, a flick
  on a trackpad) never intersects and stays invisible permanently. Extending
  the root upwards means anything at or above the trigger line counts as seen.
  The negative bottom margin is what actually sets the trigger line.
- **Each element is unobserved once revealed,** so scrolling back up does not
  replay it. Replaying on every pass turns a page into a slideshow.

Stagger is applied as a `transition-delay` computed from the element's index
among its own `.e3-rise` siblings, so a row of three cards arrives in sequence
while a separate list starts counting from zero again.

Under `prefers-reduced-motion` everything is visible immediately with no
movement at all.

The title lift uses `transform`, which does not reflow, so the row keeps its
height and the text below it never moves. Only the title appears to float.

## Known gaps

- Image slots in the research cards and news items are empty.
- The fifth publication is a placeholder.
- Nav and footer links all point at `#`.
- No mobile navigation; the nav is hidden on narrow screens.
