# SPORTMOMENTE 🏆

> Professionelle Bildgalerie-Website für Sport-Events — mit verstecktem Admin-Panel, Kollektions-Passwörtern, Share-Links und cineastischen Animationen.

**Live:** [sportmomente.paulfaller.me](https://sportmomente.paulfaller.me)

---

## Features

### Öffentliche Website
- 🎬 **Cinematic Loader** — animierter Balkenprojektions-Effekt beim Laden
- ✨ **Particle Canvas** — leuchtende Hintergrund-Partikel im Hero (Desktop)
- 🃏 **3D-Tilt-Karten** — Galerie-Karten reagieren auf Mausbewegung
- 🔤 **Text-Scramble** — Titel scramble beim Öffnen einer Galerie
- 📜 **Parallax + Scroll-Reveals** — Hero und Sections
- 🔗 **Share-Links** — jede Galerie hat einen eigenen, kopierbaren Link
- 🔒 **Collection-Passwörter** — optionaler Passwortschutz pro Galerie
- 🔍 **Live-Suche** — Filter nach Name, Autor, Kategorie

### Admin-Panel (versteckt)
- 🙈 **Versteckter Zugang** — 3× auf `· · ·` im Footer klicken
- 🔐 **SHA-256 gehashte Passwörter** — kein Klartext (WebCrypto API)
- 🚦 **Rate Limiting** — max. 5 Loginversuche / 5 Minuten
- 📁 **Galerien verwalten** — erstellen, bearbeiten, löschen
- 🔑 **Kollektions-Passwörter setzen** — pro Galerie
- 💾 **Persistenz** — localStorage mit Versionierung
- 📊 **Statistiken** — Bilder, Galerien, gesperrte Kollektionen

### Mobile-Version
- 📱 **Touch-first** — Bottom Navigation, große Tap-Targets
- 👆 **Swipe im Lightbox** — Links/Rechts wischen
- 📋 **Bottom Sheets** — natives iOS/Android-Feeling
- 🔒 **Safe-Area-Insets** — iPhone Notch & Home Bar
- 🚀 **Performance** — keine schweren Animationen, optimiert

---

## Deployment auf `sportmomente.paulfaller.me`

### Vercel (empfohlen)

```bash
# 1. In Vercel importieren
# → vercel.com/new → GitHub Repo "GhostyShot/sportmomente"
# → Framework: Other (statische Files)
# → Root: /

# 2. Domain verbinden
# Vercel: Settings → Domains → sportmomente.paulfaller.me
# DNS: CNAME sportmomente → cname.vercel-dns.com
```

### DNS-Eintrag

| Typ | Name | Wert |
|-----|------|------|
| CNAME | sportmomente | cname.vercel-dns.com |

---

## Dateistruktur

```
sportmomente/
├── index.html      # Desktop-Version
├── mobile.html     # Mobile-Version
├── 404.html        # Custom 404
├── js/
│   └── core.js     # Security, Storage, Utilities
├── vercel.json     # Deployment + Security Headers
└── _headers        # Netlify Security Headers
```

## Sicherheit

| Bereich | Maßnahme |
|---------|----------|
| Admin-Passwort | SHA-256 + Salt (WebCrypto) |
| Kollektion-PW | SHA-256 + Salt + Collection-ID |
| Brute Force | Rate Limit 5/5min |
| Admin-Zugang | Versteckt (kein Button) |
| Input | HTML-Escape + MaxLength |
| Headers | CSP, X-Frame-Options, nosniff |

---

© 2026 Sportmomente | Paul Faller
