# Portfolio

The original portfolio markup and stylesheet are preserved in `src/portfolio-body.html` and `style.css`, with React rendering the original page and the new contribution section. The project uses Vite, React, TypeScript, Tailwind CSS, and shadcn/ui configuration.

## Development

```sh
npm install
npm run dev
npm run build
```

Reusable UI components belong in `components/ui`. The `@/components/ui` alias and `@/lib/utils` helper are configured for shadcn components. To add more shadcn components, run:

```sh
npx shadcn@latest add button
```

The activity section loads daily contributions for `msrishav-28` from the public GitHub Contributions API. It uses the same contribution data in the heatmap and Commit Bonsai views and shows an explicit error with a retry action if the service is unavailable.
