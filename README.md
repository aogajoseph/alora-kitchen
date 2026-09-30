# Alora Kitchen — Vite + React + TypeScript starter

A responsive starter site inspired by the supplied Alora Kitchen portfolio concept.

## Stack

- Vite
- React
- TypeScript
- Lucide React icons
- Content-driven copy in `src/content/site.ts`
- Responsive CSS with no UI framework

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Where to customize

- `src/content/site.ts` — brand copy, navigation, menu items, hours and contact details
- `src/main.tsx` — page structure and interactions
- `src/styles.css` — visual system, responsive layout and components
- `public/images/alora-concept.png` — supplied concept artwork

## Before launch

1. Replace placeholder phone/address/email details.
2. Replace the concept artwork with production food/interior photography.
3. Connect the reservation CTA to your booking provider or form endpoint.
4. Add a favicon and social/Open Graph metadata.
5. Connect analytics and deploy to Vercel, Netlify or your preferred host.
