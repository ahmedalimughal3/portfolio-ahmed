# Ahmed's portfolio

A responsive Next.js App Router portfolio built with TypeScript, Motion, and CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Before deployment, run:

```bash
npm run lint
npm run build
```

## Project structure

- `app/` — App Router entry point, metadata, and global styles
- `components/` — Portfolio sections, navigation, project previews, experience, and shared UI
- `hooks/` — Reusable scroll behavior
- `lib/portfolio.ts` — Navigation, project, and skills content
- `public/` — Static assets

Update the sample projects, skills, and experience entries in `lib/portfolio.ts`
with your own content. Company logos are stored in `public/experience/`.
Contact details and service descriptions are also configured in
`lib/portfolio.ts`. Visitors can email or call directly from the contact section.
The Blog navigation opens an animated coming-soon dialog until a blog page is
ready.
