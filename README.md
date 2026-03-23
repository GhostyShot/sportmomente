# SPORTMOMENTE 🏆

**Bildgalerien für Handball, Fußball & Sport**

Live: [sportmomente.paulfaller.me](https://sportmomente.paulfaller.me)

---

## Features

- 📸 **Bildkollektionen** mit Titel, Fotograf, Datum, Ort, Kategorie & Beschreibung
- 🔒 **Admin-Panel** mit verstecktem Zugang (3× Footer-Klick) und Rate-Limiting
- 🔐 **Kollektions-Passwörter** — einzelne Galerien optional passwortschützen
- 🔗 **Share-Links** — jede Galerie einzeln teilbar (WhatsApp, Instagram, E-Mail)
- 📱 **Responsive** — separate optimierte Versionen für Desktop & Mobile
- ⚡ **Performance** — Partikel-Canvas, 3D-Tilt, Scroll-Reveals, Counter-Animationen
- 🛡️ **Sicherheit** — CSP Headers, SHA-256 Passwort-Hashing, XSS-Sanitization

---

## Dateien

| Datei | Beschreibung |
|-------|-------------|
| `index.html` | Smart Router — erkennt Mobile/Desktop und leitet weiter |
| `desktop.html` | Desktop-Version mit allen Animationen |
| `mobile.html` | Mobile-Version (Touch-optimiert, Bottom Nav, Swipe) |
| `vercel.json` | Vercel Deploy-Config + Security Headers |
| `_headers` | Netlify/Cloudflare Headers |

---

## Admin-Zugang

- **Trigger:** Footer-Text `· · ·` **3× anklicken**
- **Standard-Passwort:** `admin123`
- **Rate-Limiting:** 5 Versuche, dann 15 Minuten gesperrt
- **Passwort ändern:** SHA-256 Hash generieren und `ADMIN_HASH` ersetzen

```js
// Im Browser (F12 → Konsole):
await crypto.subtle.digest('SHA-256', new TextEncoder().encode('MeinNeuesPasswort'))
  .then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join(''))
```

---

## Kollektions-Passwörter

Im Admin-Panel beim Erstellen/Bearbeiten einer Galerie kann optional ein Passwort gesetzt werden. Besucher müssen dieses eingeben, bevor sie die Galerie sehen können. Das Passwort wird als SHA-256-Hash gespeichert — nie im Klartext.

---

## Deploy auf Vercel

1. Repository mit Vercel verbinden
2. Subdomain `sportmomente.paulfaller.me` in Vercel → Settings → Domains eintragen
3. DNS beim Domain-Provider: `CNAME sportmomente → cname.vercel-dns.com`

---

## ⚠️ Sicherheitshinweis

**Niemals das Standard-Passwort `admin123` in Produktion verwenden!**

Nach dem ersten Deploy sofort das Passwort ändern:
1. Browser-Konsole öffnen (F12)
2. Hash generieren:
```js
(async()=>console.log(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('DeinPasswort')).then(b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''))))()
```
3. `ADMIN_HASH` in `desktop.html` und `mobile.html` ersetzen und pushen

---

© 2026 Sportmomente — Paul Faller
