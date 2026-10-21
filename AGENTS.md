<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Conventions

- Admin pages live at `/admin/*` and must render inside `AdminShell` (`src/components/site/AdminShell.tsx`), which guards on the admin session (localStorage `dgs:admin`) and renders the sidebar; user account pages render inside `UserShell`, which guards on the user session.
- All data is mock JSON seeded into a localStorage-backed store (`src/lib/store.ts`, keys prefixed `dgs:`); pages edit it through `useStore` — there is no backend.
- Every route file supplies its own `head()` via the `seo()` helper from `src/lib/seo.ts`.
