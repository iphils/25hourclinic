# Clinic photos

Drop photos here using these exact filenames and they appear in the "A look
inside" gallery on the homepage automatically:

| Filename | Shown as |
| --- | --- |
| `clinic-front.jpg` | Clinic entrance (lead photo, full width) |
| `reception.jpg` | Reception |
| `consultation-room.jpg` | Consultation room |
| `waiting-area.jpg` | Waiting area |
| `pharmacy.jpg` | Pharmacy counter |

Any file that is missing is skipped, and if none exist the gallery section and
its nav link stay hidden — so the site never shows a broken image.

**Format:** landscape JPG, around 1600×1000, under 400 KB each. Resize with:

```bash
magick input.jpg -resize 1600x1000^ -gravity center -extent 1600x1000 -quality 82 clinic-front.jpg
```

To change a caption or add a sixth photo, edit the `#gallery` section in
`index.html` — each photo is one `<figure class="shot">`.

**Please use photos the clinic owns.** Do not copy images from the Google Maps
listing unless the clinic uploaded them: reviewer photos belong to the reviewers,
and Google's terms do not permit re-hosting Maps imagery on your own site.
