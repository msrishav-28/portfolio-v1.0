# Portfolio migration checkpoint

This branch preserves the static `main` portfolio on the Vite, React 19, TypeScript, Tailwind 4, and shadcn tooling established by `copilot/commit-bonsai-activity`.

**Verification is incomplete. Do not treat this checkpoint as production approved.** The execution environment became unavailable during the last fixes and verification pass. See [the migration status report](docs/migration/REPORT.md).

The original ordered markup is in `src/portfolio-body.html`. Vite emits it into the entry document; React hydrates the same markup through `html-react-parser`. Native content and fragments remain available without JavaScript. `style.css` retains the original active rules and values. Tailwind Preflight is not enabled; CSS minification is disabled to retain original custom-property strings. Assets are byte-preserving references to the original files under `public/static`.

The unrelated contribution Activity/Bonsai implementation is excluded. Generic shadcn configuration, aliases, and utility infrastructure remain.

## Run and build

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npm run preview
```

The production build includes strict TypeScript checking. Deploy `dist` at the domain root, as configured by the target's default Vite base. There are no production environment variables, pre-existing lint/format rules, or deployment pipeline. In a runtime that cannot enumerate network interfaces, append `-- --host 127.0.0.1` to the dev/preview commands.
