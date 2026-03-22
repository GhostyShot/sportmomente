# SPORTMOMENTE

> Bildgalerie für Handball, Fußball & Sport
> Live: [sportmomente.paulfaller.me](https://sportmomente.paulfaller.me)

## Features

### Public
- Cinematic page loader with staggered bar reveal
- Particle canvas hero
- 3D magnetic tilt on collection cards
- Text scramble animation on gallery open
- Accordion photo strip
- Per-collection share links
- Live search across galleries, authors, categories
- Lightbox with keyboard & swipe navigation
- Responsive: full desktop experience + mobile-optimized build

### Admin (hidden)
- Trigger: **triple-click `· · ·`** in footer
- Password hashed with SHA-256 via `SubtleCrypto` — never stored in plaintext
- Rate-limited login: 5 attempts → 30s lockout
- Create / edit / delete collections
- Metadata per collection: title, author, date, location, category, description
- **Optional password protection per collection** (independently hashed)
- LocalStorage persistence across sessions

## Security
- Admin password: SHA-256 hashed client-side via SubtleCrypto
- 5 login attempts max, then 30s cooldown
- Admin trigger invisible — no href, no visible button
- Collection passwords independently hashed (SHA-256)
- Content-Security-Policy headers via vercel.json
- Security headers: X-Frame-Options DENY, X-Content-Type-Options, etc.

## Deploy

1. Import `GhostyShot/sportmomente` to Vercel
2. Deploy as static site (no build step needed)
3. DNS: `CNAME sportmomente → cname.vercel-dns.com`
4. Vercel → Domains → add `sportmomente.paulfaller.me`

## Change Admin Password

```js
// Run in browser console on the site:
hashPassword('your-new-password').then(h => console.log(h))
// Copy the output and replace PASS_HASH in index.html
```

## File Structure

```
sportmomente/
├── index.html      # Main app (desktop-first, responsive)
├── vercel.json     # Security headers + routing
├── manifest.json   # PWA manifest
└── README.md
```

---

© 2026 Paul Faller — sportmomente.paulfaller.me
