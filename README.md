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
| Hero height | `height:680px` on the wrapper | The video always fills the wrapper. |
| How the video fills | `object-fit` on the video | `cover` crops to fill, `contain` letterboxes. |
| Which part is kept | `object-position` on the video | `center`, `left top`, `center 30%`, and so on. |
| Zoom or nudge | add `transform:scale(1.1)` to the video | Keep `object-fit:cover`. |
| Overlay darkness | the `linear-gradient` on the `<section>` | Lower the alpha values to show more video. |

The source video is 1280x720. At viewports wider than 1280px it is upscaled,
so a 1920x1080 master would look sharper.

## Editing the content

All text lives in one place: the `renderVals()` method in the script block at
the bottom of `index.html`. Research areas, partners, news items, publications,
and footer links are plain arrays there. The markup above reads them through
`{{ }}` placeholders, so you rarely need to touch the HTML to change wording.

## Known gaps

- Image slots in the research cards and news items are empty.
- The fifth publication is a placeholder.
- Nav and footer links all point at `#`.
