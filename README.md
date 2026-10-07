# Walrus Landing Page Template

A free, community-made landing page template for **[Walrus](https://www.walrus.xyz)**, the decentralized storage network built on **[Sui](https://sui.io)**. Built with plain HTML, CSS and JavaScript. No frameworks, no build step.

Made for the **Epoch Names October Template Contest**.

![Walrus landing page preview](screenshot.png)

> Add a screenshot of the page as `screenshot.png` in the project root so the preview above shows up.

## Features

- **Interactive resilience demo.** Store a file across 16 nodes, then knock nodes offline and watch Walrus rebuild it until too few pieces remain. Nodes can be clicked or operated by keyboard.
- **Animated hero.** The Walrus mascot over a live network canvas, with data packets travelling between nodes and a gentle pointer tilt on desktop.
- **Typed terminal.** An example `walrus store` and `walrus read` session that types itself out when scrolled into view, with a replay button.
- **Network parameters.** Animated counters for shards, epoch length and maximum storage period, with the source linked.
- **Use cases, WAL and Sui sections**, a copy-to-clipboard command block, and a footer with social links.
- **Responsive and accessible.** Works down to phone width, has visible keyboard focus, a skip link, and respects `prefers-reduced-motion`.

## Project structure

```
walrus-template/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── favicon.svg
    ├── sui-wordmark.svg
    ├── walrus-mascot.webp
    └── glass-tiles.webp
```

## Run it locally

No install needed. Open `index.html` in your browser.

Or serve the folder with any static server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Customize

| What | Where |
| --- | --- |
| Colors, fonts, corner radius | The `:root` variables at the top of `style.css` |
| Copy and sections | `index.html` |
| Network stats | The `data-count` values and text in the `#network` section of `index.html` |
| Terminal session | The `script` array in the terminal section of `script.js` |
| Demo size and rebuild rule | `N` and `NEED` at the top of the demo section in `script.js` |
| Footer and social links | The footer in `index.html` |

## Brand colors

| Name | Hex |
| --- | --- |
| Ice Cold | `#97F0E5` |
| Kingfisher Daisy | `#420892` |
| White | `#FFFFFF` |

## Data sources

Network parameters (1,000 shards, 2-week Mainnet epochs, up to 53 epochs of storage) come from the [Walrus network reference](https://docs.wal.app/docs/network-reference), as of 7 October 2026. These values can change, so check the docs before relying on them.

The resilience demo is a simplified model for illustration. The real network spreads each file across 1,000 shards.

## Installing as an Epoch Names template

1. Go to [names.epochsui.com](https://names.epochsui.com), open **Register** and choose **Create a template**.
2. Upload this folder, including the `assets` folder.
3. Save it as category **Landing**, with a cover and at least one screenshot.
4. Keep it **Free** and leave **Protect the source** off.

## Credits and disclaimer

- Walrus and Sui names, logos and mascot artwork belong to their respective owners (Mysten Labs and the Walrus Foundation).
- This is an unofficial community project. It is not affiliated with or endorsed by Walrus, Sui or Mysten Labs.
- Fonts: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono), loaded from Google Fonts.

## Author

Built by **Johnny**.

- GitHub: add your profile link here
- X: add your handle here
