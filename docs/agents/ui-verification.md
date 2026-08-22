# UI verification for agents

How to verify design-system UI changes: automated regression in CI, interactive checks in Cursor via Playwright MCP, and when to use each.

**Related:** [browser-tests](../../.agents/skills/browser-tests/SKILL.md) · [storybook](../../.agents/skills/storybook/SKILL.md) · [docs-tests](../../.agents/skills/docs-tests/SKILL.md) · [skills.md](skills.md)

## Layers

| Layer             | Tool                                                        | Purpose                                                         |
| ----------------- | ----------------------------------------------------------- | --------------------------------------------------------------- |
| **CI regression** | `*.browser.test.tsx` (Vitest browser + Playwright Chromium) | Lock behavior, DOM state, layout contracts (`getComputedStyle`) |
| **CI smoke**      | Storybook + `@storybook/addon-vitest`                       | Every story mounts without crashing                             |
| **CI docs**       | `pnpm test:storybook-docs`                                  | Show code + MCP manifest snippet snapshots                      |
| **Agent session** | Playwright MCP + Storybook                                  | Drive UI, capture screenshots for chat review                   |
| **Manual**        | `pnpm start` → http://localhost:6006                        | Human visual review, a11y addon in UI                           |

There is **no** pixel-regression stack (Chromatic, Percy, `toMatchScreenshot`) in this repo.

## Playwright MCP (Cursor)

Configured in `.cursor/mcp.json` as `playwright` (`npx @playwright/mcp@latest --browser=chrome`).

After adding or editing the entry, reload MCP in Cursor (Settings → MCP → restart server, or reload window).

**Prerequisites**

```bash
pnpm --filter @drivenets/design-system install:playwright
pnpm --filter @drivenets/design-system start   # Storybook on :6006
```

For **drivenets-ds** MCP docs during the same session, keep Storybook running — manifests are served from `http://localhost:6006`.

**Headed vs headless**

- Default MCP runs headed so you can watch the browser.
- If the agent subprocess has no display, add `--headless` to the `args` array in `.cursor/mcp.json` — screenshots still work.
- See [Playwright MCP docs](https://playwright.dev/docs/getting-started-mcp) for HTTP transport if headed fails from the IDE worker.

**Do not commit API tokens** in `.cursor/mcp.json`. Prefer Cursor secret handling or env vars for other MCP servers.

## Storybook URLs

Story `title` in `*.stories.tsx` maps to Storybook IDs via `toId` (lowercase, slashes → hyphens).

| Story meta `title`                   | Story export `Default` | Canvas iframe (clean screenshots)                                                                 |
| ------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------- |
| `Components/ButtonV3`                | `Default`              | `http://localhost:6006/iframe.html?id=components-button-v3--default&viewMode=story`               |
| `Components/Table/Resizable Columns` | `Default`              | `http://localhost:6006/iframe.html?id=components-table-resizable-columns--default&viewMode=story` |

**Prefer `iframe.html`** for screenshots — no Storybook manager chrome.

| URL pattern                                          | Use                                      |
| ---------------------------------------------------- | ---------------------------------------- |
| `iframe.html?id=<story-id>--<export>&viewMode=story` | Canvas story — interaction + screenshots |
| `/?path=/story/<story-id>--<export>`                 | Full Storybook UI with sidebar           |
| `/?path=/docs/<docs-id>`                             | Autodocs (Show code panels)              |

To find the exact ID: open the story in Storybook and copy from the address bar, or infer from `title` + export name.

**Production build** (matches CI docs tests and GitHub Pages):

```bash
pnpm build:storybook
# serve packages/design-system/storybook-static locally, then use the same URL patterns on that port
```

Dev (`pnpm start`) is faster; prod static matches deployed Storybook and React Compiler output.

## Agent workflow (MCP + drivenets-ds)

1. **list-all-documentation** / **get-documentation** (`drivenets-ds`) — props, variants, story names before driving UI.
2. Playwright MCP **navigate** to the `iframe.html` URL for the target story.
3. **Click / type / keyboard** via accessibility tree (or screenshot + vision if needed).
4. **Screenshot** before and after the interaction; save to `tmp/ui-captures/` in the workspace for chat review.
5. If behavior should regress in CI, add or extend `__tests__/*.browser.test.tsx` — MCP sessions are not replayed in PR checks.

## Example prompts (Cursor Agent)

**Screenshot a story**

> Start Storybook if needed. Open `components-button-v3--primary` in iframe mode, screenshot to `tmp/ui-captures/button-v3-primary.png`, and show me the image.

**Before/after interaction**

> In Storybook, open `components-select--default`, screenshot, open the select and pick an option, screenshot again. Put both in `tmp/ui-captures/`.

**Verify a fix with docs context**

> Use drivenets-ds for DsDrawer props, then Playwright MCP: open the drawer default story, click the trigger, confirm the panel is visible and screenshot it.

**Pure CSS tweak (no new test)**

> Open `components-typography--heading` in Storybook iframe, screenshot for visual review. No browser test unless we add a layout contract.

**Lock interaction in CI**

> After MCP confirms the menu closes on Escape, add a regression in `ds-dropdown-menu.browser.test.tsx` and run the file with vitest `--run`.

## Commands (deterministic checks)

```bash
# Single component browser test
pnpm --filter @drivenets/design-system test \
  packages/design-system/src/components/ds-button-v3/__tests__/ds-button-v3.browser.test.tsx --run

# All browser tests
pnpm --filter @drivenets/design-system test:browser --run

# Docs snippets (production storybook-static)
pnpm test:storybook-docs --run

# Story smoke (included in default test)
pnpm --filter @drivenets/design-system test --run
```

## Optional frameworks (not configured here)

For autonomous exploration or NL → Playwright generation on a full app URL, see [agentic-test-explorer](https://github.com/srbarrios/agentic-test-explorer) (Playwright + optional MCP) or [Specter](https://github.com/khaledbourghida/specter). For this design system, Playwright MCP + existing `*.browser.test.tsx` is the default stack.
