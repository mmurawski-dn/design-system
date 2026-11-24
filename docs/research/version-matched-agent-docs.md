# Version-matched agent docs for `@drivenets/design-system`

Researched 2026-11-24. Repo facts are read from git ref `drivenets/main` @ `f180d8fc2` (2026-11-23). npm facts come from tarballs downloaded from registry.npmjs.org and read, never run. "Unverified" means no primary source confirmed it.

## Summary

- **The problem is worse than "latest version".** The MCP fetches manifests built from `main` [1 L6][9 L4-7]. `main` has 12 unreleased changesets. The live `components.json` already documents `DsCable` and `DsTechnology`, and neither is in the latest npm release, 0.28.0 [12][13][14]. Hotfix lines (`release-0.18`, `release-0.24`) are still published [10 L5-8][14].
- **The Storybook manifest format is documented but not stable.** Storybook says the schema "is not yet stable and should not be considered a public API", and AI features are "in preview" [22][26]. `components.json` carries a `v` discriminator (`0` inline, `1` split/`$ref`), and `@storybook/mcp` 10.6.7 reads both [16 `index.d.ts` L164-299].
- **There is no first-party way to produce manifests or agent docs outside a build.** No CLI or API makes manifests without `storybook build`. `storybook index` emits only `index.json` [27]. Storybook has no `llms.txt` or per-component Markdown emitter. Markdown exists only as MCP tool output [19][22][23].
- **`@storybook/mcp` reads manifests only through a callback.** It is a library with no bin. Manifests come through a `manifestProvider(request, path)` callback, and the default fetches relative to the request URL [16 README L9-12, L172-189]. Our `--manifests-dir` is our own code [1 L44-48].
- **Precedent splits into two camps.** Hosted docs, latest only: shadcn, Chakra, Ark, Mantine's MCP, Base UI. Docs that travel with the installed package: ui-sdk, Next.js (`node_modules/next/dist/docs` plus a managed `AGENTS.md` block), TanStack Intent [39][40][41]. MUI sits in between, with a hosted per-major `llms.txt` catalog that the agent picks from [33].
- **Recommendation: (a) now, then (b).** First, ship `manifests/*.json` in the DS tarball and have the MCP resolve them from the consumer's install, falling back to Pages. This is about +2.1 MB unpacked and about +275 KB gzipped (measured below). Then generate `llms.txt` plus per-component `.md` from the same JSON for agents that do not use MCP (b). Skip (c): it adds hosting work and a network dependency, and the gh-pages branch is already 871 MB [11][45].
- **Fix independently of the options above:** the server tells agents to call `list-all-documentation` and two other tools. Those tools do not exist with `@storybook/mcp` ≥10.6, which registers `docs-list`, `docs-show` and `docs-show-story` [3][16][17].

## Storybook manifests (Q1)

**Schema** (`@storybook/mcp@10.6.7` `dist/index.d.ts` [16]):

- **`components.json`** is `{ v: 0 | 1, components: Record<id, entry> }` (L164-267).
  - **v0 entries** are inline (L42-100). Fields: `id`, `name`, and optional `path`, `import`, `description`, `summary`, `jsDocTags`, `apiDescription`, `renderer`, `error{name,message}`, `subcomponents` and `docs` (attached MDX). The docgen fields `reactDocgen`, `reactDocgenTypescript` and `reactComponentMeta` are typed `any`. `stories[]` holds `{name, id?, snippet?, description?, summary?, jsDocTags?, error?}`.
  - **v1 entries** are shallow rows. They point to other files through `docgen.$ref`, `stories.$ref` and `docs[*].mdx.$ref` (L106-162).
- **`docs.json`** is `{ v, docs: Record<id, {id, name, title?, path?, content?, summary?, error?}> }`. In v1 the content moves to `mdx.$ref` (L269-298).
- **Manifest paths** are fixed: `./manifests/components.json` (required) and `./manifests/docs.json` (optional) (L343-344; README L186-189). `docs.json` is fetched with `Promise.allSettled`, which is why it is optional (`dist/index.js` L1230).
- **The DS live manifests are v0** [13]: 109 components, 690 stories and 7 docs entries. Five components have docgen `error`s instead of props: `card`, `segmentgroup`, `stack`, `tabs` and `tree`.

**Documentation, versioning and stability**

- The schema is documented, with example fields, at `/docs/ai/manifests` [22].
- That page says the schema "is not yet stable and should not be considered a public API". It does not mention v0 or v1. It describes only a "ref-based format" used when `experimentalDocgenServer` is on [22].
- Storybook defines its "Preview" stage as allowing "minimal breaking changes in minor releases" [26].
- The `componentsManifest` flag defaults to `false` and carries no experimental label [25]. `@storybook/addon-mcp@10.6.7` forces it to `true` in its preset (`dist/preset.js` L1625-1628) [18]. The DS sets no `features` of its own [8].

**When it was introduced** (Storybook `CHANGELOG.md` [20]):

| Version | Change | CHANGELOG line |
| --- | --- | --- |
| 10.1.0 | Component manifest for React, listed among the "experimental features" (#32751) | L1059, L1109 |
| 10.2.0 | MDX manifest, which is `docs.json` (#33408) | L883 |
| 10.3.0 | Flag renamed `experimentalComponentsManifest` → `componentsManifest`, default `true` | L715 |
| 10.3.5 | Default switched back to off; `addon-mcp` ≥0.5.0 re-enables it | L621-624 |
| 10.5.0 | Ref-based (v1) manifest added with the docgen service | L353, L388 |
| 10.6.0 | `addon-mcp` and `@storybook/mcp` moved onto shared core toolsets (#35858) | L177 |

The rename of the tools to `docs-*` falls between `@storybook/mcp` 0.8.0, which still uses `list-all-documentation` (`dist/index.js` L891), and 10.6.1 [17]. The exact PR is unverified.

**Generating manifests without a full build**

- **Nothing is documented.** `storybook index` writes only `index.json` [27], and the manifests page lists no command for this [22].
- **The only write path is the build.** In source, `storybook build` calls `writeManifests` only when `features.componentsManifest` is on and the preview is not ignored (`storybook@10.6.7` `dist/core-server/index.js` L7587; `chunk-J2VFTQOT.js` L1779) [19].
- **Two internal routes exist, both untested:**
  - `loadManifests(presets)` is exported from `storybook/internal/core-server` (`index.d.ts` L512), next to `experimental_loadStorybook`.
  - The `storybook tools <toolset> <tool>` CLI has `--no-attach` ("Load the project configuration without attaching"), `--json` and `-o <path>`, with Markdown as the default output (`dist/bin/core.js` L3235-3266, L5044). Its docs toolset is wired to `getManifests: () => loadManifests(...)` (`common-preset.js` L2328). This command is not on the cli-options docs page [27].
  - Either route might generate manifests or Markdown without a Vite build. I have not run them, so this is unverified.

**Local or file sources in `@storybook/mcp`**

- **The package itself takes no URL or directory option.** You pass a `manifestProvider(request, path, source?) => Promise<string>` that returns the raw JSON [16 README L172-189].
- **The default provider derives the URL from the incoming request** and throws if there is no request (`dist/index.js` L1194).
- **The repo's `code/lib/mcp/serve.ts` reads from a directory or a URL**, but it is "a development harness and is not part of the published package" [16 README L23-26][21].
- **That harness has the same limit as ours.** Both it and our provider reduce paths with `basename(path)` [21 L12-15][1 L44-47]. So neither can follow v1 `$ref`s such as `../services/addon-docs/mdx/<id>.json` (`chunk-J2VFTQOT.js` L360, L398) [19].

**`llms.txt` or Markdown from Storybook**

- **None for user Storybooks.** `storybook@10.6.7` mentions `llms.txt` only to point agents at Storybook's own docs (`chunk-36NQFAEF.js` L106) [19].
- **`storybook skills` is not consumer docs.** Its skills are `stories`, `write-story` and `setup`, all about writing stories (`dist/cli/skills/content/index.js` L11-21) [19].
- **Markdown appears only as `docs-show` tool output** [16]. `@storybook/mcp` does not export its Markdown formatters, but it does export the valibot schemas `ComponentManifestMap` and `DocsManifestMap` (`index.d.ts` L883).

## Options for version-matched docs (Q2)

**Measured size** (fetched 2026-11-24 [13]):

| | Raw | `gzip -9` |
| --- | --- | --- |
| `components.json` | 1,984,831 B | 252,356 B |
| `docs.json` | 127,229 B | 23,129 B |
| DS 0.28.0 tarball, for comparison [14] | 9,337,558 B unpacked (945 files) | 2,160,066 B packed |

- Shipping both JSON files adds about **+23% unpacked** and about **+13% packed**. npm's own compression level is unverified, so the packed figure is an estimate.
- About two-thirds of the JSON is `stories` and `reactDocgen`.
- The JSON leaks CI absolute paths (`/home/runner/...`) and holds about 24 KB of docgen error dumps containing full source. Both could be stripped. `reactDocgen` is typed `any` and `error` is optional in the schema, so a stripped file still validates [16].

| | (a) JSON in tarball, MCP auto-detects | (b) `llms.txt` + `.md` in tarball | (c) Per-version JSON on Pages |
| --- | --- | --- | --- |
| Version match | Exact, by construction | Exact, by construction | Exact if the right version is resolved and was published |
| Works without MCP | No | Yes, any agent that reads files | No |
| Code change | Release job copies manifests; MCP resolves dir, falls back to URL | A generator we write ourselves (no first-party emitter) | Deploy job per release, backfill, version resolver |
| npm size | +2.1 MB raw / ≈+275 KB gz (less if slimmed) | Unmeasured; can be smaller than JSON | None |
| Main risk | Storybook schema drift between old tarballs and the latest MCP | Maintaining our own format | Hosting state, network dependency, backfill |

**(a) Ship `manifests/*.json` and auto-detect them.**

- **Pros**
  - Reuses the `--manifests-dir` code path [1 L46-48].
  - Works offline.
  - Brings the MDX guidelines (`docs.json`) into the package. Today they are excluded by `!**/stories` [7 L23-33].
- **Cons and risks**
  1. **The release job must run `storybook build`.** `release.yml` does not today [10], and the docs deploy is a separate workflow triggered on `main` [9].
  2. **Path resolution needs work.**
     - The DS `exports` map has no `./package.json` or `./manifests/*` entry [7 L9-22], so `require.resolve` of those paths fails. Read through the filesystem instead, or add exports entries.
     - The MCP spec does not define the working directory of stdio servers.
     - Roots are deprecated in MCP 2026-07-28, which suggests passing directories "via tool parameters ... or server configuration" instead [42][43]. tmcp supports roots only when stateful [44].
     - So prefer an explicit `--project-dir` with a cwd walk-up as a heuristic. Whether each client launches stdio servers in the project directory is unverified.
  3. **Old tarballs will contain old manifests.** `npx -y` always runs the latest MCP, so the reader is newer than the writer. Mitigations:
     - Keep the exact `@storybook/mcp` pin [6 L36].
     - Add fixture tests over shipped manifests, validated with the exported schemas.
     - Note that Storybook may change the format in minor releases [26].
  4. **Turning on `experimentalDocgenServer` would break this.** Manifests switch to v1 with `../services/...` refs, which would have to ship as well, and our provider's `basename()` would need fixing [1][19].
  5. **Versions ≤0.28.0 contain no manifests,** so the remote fallback must stay.

**(b) Generate `llms.txt` + per-component `.md` and ship them.**

- **Pros**
  - Matches the ui-sdk and Next.js precedent: the docs travel with the version, and an `AGENTS.md` pointer makes them discoverable [39][40].
  - Consumers stop depending on Storybook's preview schema at read time; it matters only at our build time.
  - Works for agents without MCP.
- **Cons**
  - We must write and own the formatter, since Storybook has no emitter and does not export its formatters [16][19].
  - Alternatives are to reuse the MCP tools in-process, or `storybook tools docs ... -o` (unverified).
  - It is a second representation to keep in sync.
  - It needs a consumer-side step, an `AGENTS.md` note. ui-sdk ships a prompt for this, and Next.js writes the block itself [39][40].
- **Format:** follow llmstxt.org. That means an H1, a `>` summary, and H2 sections listing `[name](url): notes`, plus an optional `Optional` section [29]. The spec is written for site roots and subpaths. In-package `docs/llms.txt` is ui-sdk's convention, not the spec's.

**(c) Per-version manifests on Pages.**

- **Pros**
  - No npm size cost.
  - Consumers on old versions can be backfilled.
  - Precedent:
    - MUI's MCP fetches a catalog of `{name, version, llmsUrl}` that points to immutable deploy URLs. The agent may pass `name@version`; a bare name gets the latest [33].
    - Storybook package composition also points `package.json` at a "Storybook at the version you want" [28].
- **Cons and risks**
  1. **Deploy runs on every push to `main`.** It does `rm -rf ./*` and commits, so versioned folders would be wiped [9 L4-7, L48-54].
  2. **A per-release job is needed for `main` and `release/X.Y.x`** [10].
  3. **Backfill means rebuilding 42 tags.** The 699 gh-pages commits map to `main` commits, not releases [11].
  4. **It still needs the same installed-version detection as (a).**
  5. **Network dependency** on Pages.
  6. **The gh-pages branch tree is 871 MB, 855 MB of it a committed `.turbo/cache`.**
     - It has been growing since about June 2026: 86 MB in June, 461 MB in September, 855 MB in November [11].
     - The cause: `rm -rf ./*` skips dotfiles, and gh-pages has no `.gitignore` (`main` ignores `.turbo` at `.gitignore` L7).
     - It is not served (404), but GitHub's recommended source limit is 1 GB [45].

## Precedent (Q3)

| Library | Where docs live | Version-matched? | Skill or rules |
| --- | --- | --- | --- |
| shadcn/ui | Site `llms.txt` (about 110 links to HTML pages) [32]. MCP via `npx shadcn@latest mcp`, which reads registries from the project's `components.json` [30]. `shadcn info` links to live `…/docs/components/<base>/[component].md` (`shadcn@4.23.0` `dist/index.js`) | No. Latest only. The code is copied into the app, so drift matters less | Skill installed with `skills add shadcn/ui`. It runs `shadcn info --json` for project context [31]. Source is `skills/shadcn/` in `shadcn-ui/ui` |
| MUI | Per-product `llms.txt` with `.md` links [33]. Previous major at `v7.mui.com/material-ui/llms.txt` (200; `v6` returns 404). MCP `@mui/mcp` → `@mui/x-agent-tools`, which fetches a catalog from `chat-backend.mui.com/v1/public/packages/list` [33] | Per major: `@mui/material` 9.6.0 / 7.3.11 / 6.5.0 / 5.18.0. The agent picks `name@version`; a bare name gets the latest. Not auto-detected for docs | 4 skills in `mui/material-ui/skills` (`SKILL.md` + `AGENTS.md`). MCP docs suggest a rules file [33] |
| Chakra UI | Site `llms.txt`, `llms-full.txt` and topic files, v3 only [34]. MCP `@chakra-ui/react-mcp` fetches `https://chakra-ui.com/api/...` (`dist/stdio.js` L22) | No. Latest only. Skills "check `package.json`" to fall back to v2 | 3 skills under `skills/` in `chakra-ui/chakra-ui`, installed with `npx skills add` [34] |
| Mantine | `llms.txt` indexing about 460 `.md` pages under `/llms/`, plus `llms-full.txt` (~4.6 MB) [35]. Previous major at `v8.mantine.dev/llms.txt` (`v7` returns 404). MCP reads static JSON from `mantine.dev/mcp`, configurable with `MANTINE_MCP_DATA_URL` ("local static files") (`esm/server.mjs` L10) | `llms.txt`: per major. MCP: latest only (`v8…/mcp/index.json` returns 404) | Skills repo `mantinedev/skills` (3 skills) [35] |
| Ark UI (we build on it) | `llms.txt` plus `llms-{react,vue,solid,svelte}.txt` [36]. MCP `@ark-ui/mcp` fetches `https://ark-ui.com/api` (`dist/stdio.js` L22) | No. The site has a version picker, but the `llms` routes are not versioned (unverified whether they follow it) | None found. `chakra-ui/ark` has no `skills/` folder |
| Radix | No `/llms.txt` (404 on 2026-11-24). Per-page `.md` served, e.g. `primitives/docs/overview/introduction.md` (200) [37] | No | None found |
| Base UI | `llms.txt` with 79 `.md` links; "View as Markdown" on each page [38] | No | None found (unverified) |
| ui-sdk | Inside each npm package: `files: [dist, docs, skills]`. `@ui-sdk/react` ships `docs/llms.txt` plus 55 component `.md` files (2.6 MB of 3.7 MB unpacked) [39] | Yes. SKILL.md L19 says "Prefer the installed copy: it matches the version in the project" | `node_modules/@ui-sdk/core/skills/ui-sdk/SKILL.md`. Primary install is `npx skills add vercel-labs/ui --skill ui-sdk`; the in-package copy is the fallback (`docs/agents.md` L337-340). The setup prompt adds an `AGENTS.md` note (`@ui-sdk/react` `docs/llms.txt` L26) |
| Next.js (extra) | `node_modules/next/dist/docs/` from 16.2. Managed `AGENTS.md` block from 16.3. Also `/docs/llms.txt` and per-page `.md` [40] | Yes | Skills reserved for workflows, not lookups. Vercel reports bundled docs at 100% pass versus up to 79% for skills. That is a vendor claim [40] |
| TanStack Intent (extra) | Skills shipped inside library npm packages. `intent install` writes agent-config guidance [41] | Yes. `intent stale` checks for version drift | It is a skills framework [41] |

**Notes**

- **Vendor MCP servers fetch the vendor's live site** (Chakra, Ark, Mantine, shadcn). Only MUI exposes versions, and only at major granularity.
- **Every library that is truly version-matched ships the docs in `node_modules`** and adds a pointer in `AGENTS.md`.
- **llmstxt.org expectations** [29]:
  - H1 is required.
  - Then an optional `>` summary, free-form detail, and H2 "file lists" of `[name](url)` with optional notes.
  - An `Optional` section holds skippable links.
  - Each page has a `.md` companion (`page.html.md`).
  - The file may sit at the root or at a subpath.
  - Nothing is said about versioning or npm packages.

## Contradictions / open questions

1. **The tool names in the brief are wrong.**
   - The brief, the DS MCP README L41-45, ARCHITECTURE L185-187 and `instructions.md` L3-14 all use `list-all-documentation`, `get-documentation` and `get-documentation-for-story` [3][4][5].
   - `@storybook/mcp` 10.6.1 and 10.6.7 register `docs-list`, `docs-show` and `docs-show-story` (`dist/index.js` L1733) [16][17]. This session's `drivenets-ds` server exposes those names too.
   - So the server instructions name tools that do not exist.
2. **The published MCP does not use 10.6.7.** `main` pins `@storybook/mcp` `10.6.7` [6 L36], but the published `@drivenets/design-system-mcp@0.1.7` depends on `10.6.1` [15].
3. **"Latest" really means unreleased `main`** (see Summary) [12][13].
4. **ARCHITECTURE and README do not match the code.**
   - **Tarball contents:** ARCHITECTURE L154 says the tarball has only `dist/{cli,server}.js`. The 0.1.7 tarball has `dist/cli.js` and `src/*` [15].
   - **Dependency:** L171-172 says `addon-mcp` depends on `@storybook/mcp`. `addon-mcp@10.6.7` has no such dependency [18].
   - **Caching:** L62-67 says entries are evicted on rejection, and README L49 says they are cached "for the lifetime of the process". The code uses a 10-minute TTL with stale-while-revalidate and `fallbackToCache` [1 L7, L59-67].
   - **Flags:** README does not document `--manifests-dir`, `--manifests-url` or `--ttl-ms` [2][4].
5. **ui-sdk nuance.**
   - `@ui-sdk/core`'s `docs/llms.txt` is the full Core docs in one 403 KB file, not an llmstxt-style index. The index-style files live in the framework packages [39].
   - The skill's primary install is `npx skills add`. The `node_modules` copy is the fallback [39].
6. **`componentsManifest` default.** It defaults to off in Storybook ≥10.3.5 [20][25]. That matches the brief, because `addon-mcp` turns it on [18].
7. **Manifest quality.** Five components ship no props in any option (docgen errors) [13].
8. **Open questions:**
   - Whether `storybook tools docs show --no-attach -o` or `loadManifests()` work headless for the DS (not run).
   - npm's actual compression ratio.
   - The working directory each client gives stdio servers.
   - Whether Radix, Base UI or Ark ship skills anywhere else.

## Sources

Repo files are cited as `drivenets/main` path + line.

1. `packages/mcp/src/manifest-provider.ts`
2. `packages/mcp/src/cli.ts`
3. `packages/mcp/src/instructions.md`
4. `packages/mcp/README.md`
5. `packages/mcp/ARCHITECTURE.md`
6. `packages/mcp/package.json`
7. `packages/design-system/package.json`
8. `packages/design-system/.storybook/main.ts`
9. `.github/workflows/deploy-storybook.yml`
10. `.github/workflows/release.yml`; npm dist-tags of `@drivenets/design-system`
11. `drivenets/gh-pages` @ `7d71e6503` (2026-11-16): `git ls-tree -r -l`, history sampled at 6 commits; `drivenets/main:.gitignore`
12. `drivenets/main:.changeset/` (12 files, incl. `ds-cable.md`); `git rev-list @drivenets/design-system@0.28.0..drivenets/main` (21 commits)
13. https://drivenets.github.io/design-system/manifests/components.json and `/docs.json` (fetched 2026-11-24)
14. `@drivenets/design-system@0.28.0` tarball and `npm view` (`dist.unpackedSize`, `dist-tags`)
15. `@drivenets/design-system-mcp@0.1.7` tarball and `npm view … dependencies`
16. `@storybook/mcp@10.6.7` tarball: `README.md`, `dist/index.d.ts`, `dist/index.js`
17. `@storybook/mcp@0.8.0` and `@10.6.1` tarballs: `dist/index.js`; `@storybook/mcp@10.6.7` `CHANGELOG.md` L105
18. `@storybook/addon-mcp@10.6.7` tarball: `package.json`, `dist/preset.js`
19. `storybook@10.6.7` tarball: `dist/_node-chunks/chunk-J2VFTQOT.js`, `chunk-36NQFAEF.js`, `dist/core-server/index.{js,d.ts}`, `dist/core-server/presets/common-preset.js`, `dist/bin/core.js`, `dist/cli/skills/content/index.js`
20. https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md
21. https://github.com/storybookjs/storybook/blob/next/code/lib/mcp/serve.ts
22. https://storybook.js.org/docs/ai/manifests
23. https://storybook.js.org/docs/ai/mcp/overview
24. https://storybook.js.org/docs/ai/mcp/sharing
25. https://storybook.js.org/docs/api/main-config/main-config-features#componentsmanifest
26. https://storybook.js.org/docs/releases/features#preview
27. https://storybook.js.org/docs/api/cli-options#index
28. https://storybook.js.org/docs/sharing/package-composition
29. https://llmstxt.org/
30. https://ui.shadcn.com/docs/mcp
31. https://ui.shadcn.com/docs/skills; `shadcn@4.23.0` tarball `dist/index.js`; GitHub API `repos/shadcn-ui/ui/contents/skills/shadcn`
32. https://ui.shadcn.com/llms.txt
33. https://mui.com/material-ui/getting-started/mcp/; https://mui.com/material-ui/llms.txt; https://v7.mui.com/material-ui/llms.txt; `@mui/mcp@0.1.10` `README.md`; `@mui/x-agent-tools@0.1.10` `docs/packages.mjs` L3, `docs/tools.mjs` L30; https://chat-backend.mui.com/v1/public/packages/list; GitHub `mui/material-ui/skills/README.md`
34. https://chakra-ui.com/docs/get-started/ai/llms; https://chakra-ui.com/docs/get-started/ai/skills; `@chakra-ui/react-mcp@2.1.1` `dist/stdio.js`; GitHub API `repos/chakra-ui/chakra-ui/contents/skills`
35. https://mantine.dev/guides/llms/; https://mantine.dev/llms.txt; https://v8.mantine.dev/llms.txt; `@mantine/mcp-server@9.8.2` `README.md`, `esm/server.mjs`; GitHub API `repos/mantinedev/skills`
36. https://ark-ui.com/docs/ai/llms.txt; https://ark-ui.com/llms.txt; `@ark-ui/mcp@1.3.0` `dist/stdio.js`; GitHub API `repos/chakra-ui/ark/contents/skills` (404)
37. https://www.radix-ui.com/llms.txt (404); https://www.radix-ui.com/primitives/docs/overview/introduction.md (200)
38. https://base-ui.com/llms.txt; https://base-ui.com/react/overview/quick-start
39. `@ui-sdk/core@0.1.0-beta.17` tarball (`package.json` `files`, `README.md` L11, `docs/llms.txt`, `docs/agents.md` L332-340, `skills/ui-sdk/SKILL.md` L10-19); `@ui-sdk/react@0.1.0-beta.17` `docs/llms.txt`; https://ui-sdk.dev/llms.txt
40. https://nextjs.org/docs/app/guides/ai-agents
41. `@tanstack/intent@0.5.6` `README.md` L13-15, L40-43, L125-133
42. https://modelcontextprotocol.io/specification/2025-06-18/client/roots
43. https://modelcontextprotocol.io/specification/2026-07-28/changelog#deprecated
44. `tmcp@1.20.1` `src/index.js` L969-999
45. https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits#usage-limits
