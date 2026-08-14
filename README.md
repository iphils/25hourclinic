# 25th Hour Clinic — website

Static single-page site for 25th Hour Clinic (Kochi, Kerala). Plain HTML, CSS
and vanilla JS — no build step, no dependencies. Deploys as-is to GitHub Pages.

```
index.html                 all page content
assets/css/styles.css      design system + layout
assets/js/main.js          mobile nav, sticky header, scroll reveal
.nojekyll                  tells GitHub Pages to serve files verbatim
```

## Clinic details currently on the site

| Field | Value |
| --- | --- |
| Phone / WhatsApp | +91 82814 47235 |
| Address | Pokkattu Building, Main Road, Opposite Nadamel Church, Kochi, Kerala |
| Hours | Open all days, 9:00 AM – 9:00 PM |
| Map | `maps.app.goo.gl/pXbPbgqW6ymwcgqXA` — lat/lng 9.9456521, 76.3485661 |

Still worth adding when known: the area name and PIN code (append to the address
in the contact list and to `addressLocality` / `postalCode` in the JSON-LD block),
and the canonical site URL in that same JSON-LD `url` field.

## The WhatsApp booking form

The `#book` section collects patient details and hands them to WhatsApp as a
pre-written message — there is no server, no database, and nothing is stored on
the site. On submit it opens `https://wa.me/918281447235?text=<encoded message>`;
the patient still taps send inside WhatsApp, so they can review it first.

Fields: type (clinic / home visit), name, age, sex, illness, preferred day and
time slot, contact phone — plus address and an optional Maps link when "home
visit" is selected. The panel beside the form is a live preview of the exact
message the clinic will receive.

Messages arrive formatted like this (`*…*` renders bold in WhatsApp):

```
*HOME VISIT REQUEST*
_Sent from the 25th Hour Clinic website_

*Patient Details*
• Name: Mariam Joseph
• Age / Sex: 62 / Female
• Illness / Reason: Severe back pain for 2 weeks. Diabetic, on metformin.

*Preferred Consultation Time*
• Day: Tue, 18 Aug 2026
• Time: Morning (9 AM – 12 PM)

*Contact*
• Phone: 98470 12345

*Home Visit Location*
• Address: Thara House, Church Road, Near water tank, Vennala, Kochi 682028
• Map link: https://maps.app.goo.gl/abc123
```

To change the destination number or the message layout, edit `CLINIC_WA` and
`buildMessage()` at the top of the booking block in `assets/js/main.js`.
To add or remove a time slot, edit the `<select id="f-time">` options in `index.html`.

## Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Live site

- Repo: <https://github.com/iphils/25hourclinic>
- Pages: builds from `main` / root, custom domain `25hourclinic.org` (set via the `CNAME` file)

Every `git push` to `main` rebuilds and redeploys within a minute.

## Custom domain DNS

At the registrar for `25hourclinic.org`, replace the existing records with:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `iphils.github.io.` |

Delete any pre-existing A / CNAME / parking records for `@` and `www` first, and
leave MX records alone if email is on the domain. Once it propagates, tick
**Enforce HTTPS** in Settings → Pages (GitHub issues the certificate itself; it
can take up to an hour after DNS resolves).

Verify with:

```bash
python3 -c "import socket;print(socket.gethostbyname_ex('25hourclinic.org'))"
curl -sSI https://25hourclinic.org | head -1
```

## Publishing a change

```bash
git add -A
git commit -m "Describe the change"
git push
```

That is the whole deploy. Check the build with `gh api repos/iphils/25hourclinic/pages/builds/latest --jq .status`.

Do not delete the `CNAME` file — GitHub reads the custom domain from it, and
removing it resets Pages back to the `github.io` URL.

## Design notes

Palette blends the Claude brand colours with a clinical accent:

- `--clay #D97757` — Claude book-cloth orange, primary accent and CTAs
- `--cream #FAF9F5` / `--sand #F0EEE6` — page and alternating band backgrounds
- `--ink #191917` — headings and the dark CTA band
- `--teal #1F5E63` — medical trust accent (links, qualifications, quote block)

Type: Fraunces (serif headings) + Inter (UI/body), loaded from Google Fonts.
