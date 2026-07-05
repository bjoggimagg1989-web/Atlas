# Atlasinn Move Map

Purpose: reorganize the project around `Atlas v3.0` as the current main design while preserving useful future modules, reference designs, source assets, and old work for review.

Status: mostly executed on 2026-07-05. `Red Atlas v1.0/` remains at root because Windows reported it was locked by another process.

## Target Structure

```text
Atlasinn/
  00_CURRENT_MAIN_DESIGN/
    Atlas v3.0/

  01_FUTURE_MODULES/
    ai-atlas/
    notecrafter/
    offline-ai/
    3d-atlas/
    reusable-code-kit/
    from-v2-product-systems/

  02_REFERENCE_DESIGNS/
    blue-navy-reference/
    red-black-gold-reference/
    v2-main-design-reference/
    v2-visual-test-reference/
    v2-functional-test-reference/

  03_SOURCE_ASSETS/
    3d-models/
    logos/
    icons/
    screenshots/
    medical-data/

  04_EXPORTS_AND_PREVIEWS/
    mobile-previews/
    packaged-html/
    screenshots/
    test-renders/

  90_ARCHIVE/
    atlas-v0/
    atlas-v1-red/
    atlas-v2-full/
    cleanup-experiments/
    old-previews/
    old-prototypes/

  99_TRASH_REVIEW/
    duplicate-cleanup-copies/
    stale-generated-test-pages/
    obsolete-prototype-files/
```

## Current Main Design

Move:

```text
Atlas v3.0/
-> 00_CURRENT_MAIN_DESIGN/Atlas v3.0/
```

Keep inside `Atlas v3.0`:

```text
admin.html
index.html
assets/
README.md
PROJECT-WORKFLOW.md
css/
js/
```

Notes:

- `index.html` and `admin.html` are the current source of truth.
- `assets/images/atlas-logo-test-transparent.png` must stay inside the v3 folder unless the HTML path is updated.
- `css/` and `js/` currently contain partial or stale extraction work. Keep them with v3 for now as extraction workbench files.

## Future Modules

Move:

```text
00_ACTIVE_APP/AI Atlas/
-> 01_FUTURE_MODULES/ai-atlas/

00_ACTIVE_APP/NoteCrafter/
-> 01_FUTURE_MODULES/notecrafter/

00_ACTIVE_APP/3D Atlas/
-> 01_FUTURE_MODULES/3d-atlas/

Atlas v2.0/04-product-systems/
-> 01_FUTURE_MODULES/from-v2-product-systems/

Atlas v2.0/05-reference/reusable-code-kit/
-> 01_FUTURE_MODULES/reusable-code-kit/
```

Optional split after moving:

```text
01_FUTURE_MODULES/notecrafter/offline-ai/
-> 01_FUTURE_MODULES/offline-ai/notecrafter-offline-ai/
```

Notes:

- These are not part of the current visual shell.
- They may still be useful for future offline AI, 3D model, NoteCrafter, data, and admin workflows.
- Do not wire them into v3 until the v3 shell is stable.

## Reference Designs

Move:

```text
Red Atlas v1.0/source-external/blue_function_reference_v2.3/
-> 02_REFERENCE_DESIGNS/blue-navy-reference/

03_REFERENCE_DATA/Red Atlas Design Reference/
-> 02_REFERENCE_DESIGNS/red-black-gold-reference/

Atlas v2.0/00-main-design/
-> 02_REFERENCE_DESIGNS/v2-main-design-reference/

Atlas v2.0/01-visual-test-design/
-> 02_REFERENCE_DESIGNS/v2-visual-test-reference/

Atlas v2.0/02-functional-test-design/
-> 02_REFERENCE_DESIGNS/v2-functional-test-reference/
```

Notes:

- These are useful for visual comparison and selective reuse.
- The blue-navy design should remain reference-only, not active implementation.
- The v2 functional test is the clearest ancestor of current v3 behavior.

## Source Assets

Rename or merge:

```text
02_SOURCE_ASSETS/
-> 03_SOURCE_ASSETS/
```

Suggested internal organization:

```text
02_SOURCE_ASSETS/3D Models/
-> 03_SOURCE_ASSETS/3d-models/

02_SOURCE_ASSETS/Logos/
-> 03_SOURCE_ASSETS/logos/

02_SOURCE_ASSETS/Icons/
-> 03_SOURCE_ASSETS/icons/

02_SOURCE_ASSETS/Screenshots/
-> 03_SOURCE_ASSETS/screenshots/

03_REFERENCE_DATA/Medical Database Prototype/
-> 03_SOURCE_ASSETS/medical-data/
```

Notes:

- Keep original Blender files, GLB files, texture folders, logo source files, and medical data here.
- Do not duplicate large model/texture folders unless a module requires its own packaged runtime copy.

## Exports And Previews

Rename or keep:

```text
04_EXPORTS_AND_PREVIEWS/
-> 04_EXPORTS_AND_PREVIEWS/
```

Keep subfolders:

```text
mobile-previews/
packaged-html/
screenshots/
test-renders/
```

Notes:

- This should contain generated artifacts only.
- It should not be a source-of-truth location.

## Archive

Move:

```text
99_ARCHIVE/
-> 90_ARCHIVE/

Red Atlas v1.0/
-> 90_ARCHIVE/atlas-v1-red/

Atlas v2.0/
-> 90_ARCHIVE/atlas-v2-full/
```

Only move `Atlas v2.0/` after extracting these:

```text
Atlas v2.0/00-main-design/
Atlas v2.0/01-visual-test-design/
Atlas v2.0/02-functional-test-design/
Atlas v2.0/04-product-systems/
Atlas v2.0/05-reference/reusable-code-kit/
```

Only move `Red Atlas v1.0/` after extracting:

```text
Red Atlas v1.0/source-external/blue_function_reference_v2.3/
```

Notes:

- Archive is for old but potentially useful history.
- Do not delete archived files.

## Trash Review

Move:

```text
Atlas v3.0-cleaned/
-> 99_TRASH_REVIEW/duplicate-cleanup-copies/Atlas v3.0-cleaned/

atlas-v3-cleanup-compare.html
-> 99_TRASH_REVIEW/stale-generated-test-pages/atlas-v3-cleanup-compare.html
```

Possible later candidates:

```text
Duplicate preview files already represented in 04_EXPORTS_AND_PREVIEWS/
Obsolete generated comparison pages
Broken one-off test HTML files
Duplicate archived copies after confirming better copies exist
```

Notes:

- `99_TRASH_REVIEW` is not immediate deletion.
- Keep this folder until the current v3 project has been verified after reorganization.

## Suggested Execution Order

1. Create the target folders.
2. Move `Atlas v3.0` to `00_CURRENT_MAIN_DESIGN/Atlas v3.0`.
3. Open and verify:

```text
00_CURRENT_MAIN_DESIGN/Atlas v3.0/index.html
00_CURRENT_MAIN_DESIGN/Atlas v3.0/admin.html
```

4. Move future modules.
5. Move reference designs.
6. Move source assets.
7. Move exports and previews.
8. Move archive folders.
9. Move trash review candidates.
10. Create a root `README.md` that explains the new folder roles.

## Verification Checklist

After moving `Atlas v3.0`, verify:

- `index.html` opens.
- `admin.html` opens.
- Logo image renders.
- Home/Admin navigation works.
- Menu panel opens.
- Markup panel opens.
- Admin Tools panel opens.
- Eldariel assistant button opens the sheet.
- Central workspace still scrolls.
- Fixed top and bottom shell remain stable at iPhone width.

## Do Not Move Yet

Do not move these until the v3 HTML is checked for direct relative paths:

```text
Atlas v3.0/assets/
Atlas v3.0/css/
Atlas v3.0/js/
```

Do not delete:

```text
Atlas v2.0/
Red Atlas v1.0/
99_ARCHIVE/
```

They should be archived or split only after the useful references have been copied or moved to their new homes.

