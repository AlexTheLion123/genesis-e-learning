# Banking Learning Hub

A frontend-only prototype for a shared, tenant-aware banking learning platform. It includes a learner experience, assessments and certificates, plus an HR administrator experience for roster imports, course assignments, dashboards, and evidence reports.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Production build

```bash
pnpm build
pnpm preview
```

## Demo behavior

- Choose either fictional bank and enter as an employee learner or HR administrator.
- Use the role switcher in the user menu to move between portals.
- Progress, quiz results, certificates, assignments, and preferences are stored in browser `localStorage`.
- All data and assets are bundled locally. The running app makes no external requests.

This prototype does not implement real authentication, synchronization, regulatory submission, or offline server synchronization.
