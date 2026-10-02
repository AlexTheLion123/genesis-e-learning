# Banking Learning Hub

A frontend-only prototype for a shared, tenant-aware banking learning platform. It includes a learner experience, assessments and certificates, plus an HR administrator experience for roster imports, course assignments, dashboards, and evidence reports.

The site has two parts:

| Path | What it is |
| --- | --- |
| `/` | The Genesis landing page (`index.html` and `site/`). "Log in" leads to the app. |
| `/app/` | The demo app (`app/index.html` and `src/`). It opens on the workspace picker. |

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173` for the landing page. Click "Log in" (or go to `http://localhost:5173/app/`) for the app. Deep links such as `/app/learn` work on reload.

## Production build

```bash
pnpm build
pnpm preview
```

The build writes the landing page to `dist/index.html` and the app to `dist/app/index.html`. A static host needs one rewrite rule: any path under `/app/` without a file extension must serve `/app/index.html`. `pnpm dev` and `pnpm preview` already do this.

## Landing page

Plain HTML, CSS and a small script, no framework: `index.html`, `site/styles.css`, `site/main.js` and `site/assets/`. It is a centered gradient hero with a product mock, a short intro, four feature cards, three options cards, a short FAQ and a demo form. It works without JavaScript apart from the form and the scroll animations.

Before the link goes out:

- The demo form checks the fields and then says "Preview only", because no endpoint is set. Set `FORM_ENDPOINT` in `site/main.js`.
- Yellow `TBC` and `Placeholder` chips mark unconfirmed items (the 2% figure, data-location wording, contact details, privacy policy). Remove the `.ph` elements once each is resolved.
- `index.html` has `noindex`. Remove it at launch.
- Roboto is not bundled. The page uses the system font, which is Roboto on Android.

`design/` holds an earlier version of the page exported from a design tool, and `scripts/patch-landing.py` repairs that export. Neither is part of the site.

## Demo app behavior

- Choose either fictional bank and enter as an employee learner or HR administrator.
- Use the role switcher in the user menu to move between portals. "Leave workspace" returns to the workspace picker.
- Progress, quiz results, certificates, assignments, and preferences are stored in browser `localStorage`.
- All data and assets are bundled locally, with one exception: Lesson 1 of the AML course embeds a third-party video (YouTube ID `W-VVV1lkbfA`, "Money laundering and terror financing: What is the FATF?", OECD). Nothing is requested from YouTube until the learner presses play, and the Low bandwidth toggle hides it. It uses YouTube's official player only; the video is not downloaded or hosted here. Check it is still embeddable before outreach. Production bank content should be self-hosted or come from the bank's own library, since many bank networks block YouTube.

This prototype does not implement real authentication, synchronization, regulatory submission, or offline server synchronization.
