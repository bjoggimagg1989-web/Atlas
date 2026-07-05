# Atlas v3.0

Atlas v3.0 is the clean consolidation of the current red / black / gold Atlasinn prototype.

## Source

- Visual and functional source of truth: `Atlas v2.0/02-functional-test-design/admin-functional-test.html`
- `Atlas v2.0` remains unchanged as the archive/reference layer.

## Files

- `index.html` - Home shell.
- `admin.html` - Admin shell.
- `css/atlas-shell.css` - Shared visual system.
- `js/atlas-shell.js` - Shared menu, Eldariel, drawer, and admin design controls.
- `js/markup-tools.js` - Shared markup annotation tool.
- `js/admin-tools.js` - Reserved for future admin-only expansion.
- `PROJECT-WORKFLOW.md` - Compact Codex workflow instructions.

## Current Behavior

- Home and Admin share the same top shell, top menu, bottom dock, Eldariel mode, drawer state, markup state, and admin design controls.
- The active account is fixed as Admin through the `atlasinn.v3.admin.*` localStorage namespace.
- No backend, login, database, real medical records, or real AI calls are implemented.

## Preview

Open `index.html` from the local preview server, then use Menu -> Admin to move between pages.
