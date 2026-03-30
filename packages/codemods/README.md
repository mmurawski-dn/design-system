# @drivenets/codemods-design-system

> Codemods and CLI tools for automating `@drivenets/design-system` migrations

Applies jscodeshift transformations to your codebase based on the migration type you choose. Each migration bundles all breaking-change transforms for that version.

## Usage

```bash
npx @drivenets/codemods-design-system [options]
```

## Options

### `--migration` (alias: `-m`)

- **Description**: Specifies which migration to run.
- **Choices**: `v1`
- **Required**: Yes

```bash
npx @drivenets/codemods-design-system --migration v1
```

### `--target` (alias: `-t`)

- **Description**: Target directory where transformations will be applied.
- **Default**: Current working directory
- **Required**: No

```bash
npx @drivenets/codemods-design-system --migration v1 --target /path/to/your/project
```

### `--extensions` (alias: `-x`)

- **Description**: File extensions to include.
- **Choices**: `jsx`, `tsx`, `js`, `ts`
- **Default**: `jsx`, `tsx`

```bash
npx @drivenets/codemods-design-system --migration v1 --extensions jsx tsx ts
```

### `--verbose` (alias: `-v`)

- **Description**: Enable verbose mode with detailed transformation logs.
- **Default**: `false`

### `--yes` (alias: `-y`)

- **Description**: Skip confirmation prompts when Git working directory is not clean.
- **Default**: `false`

## Included Migrations

### `v1` Migration

Migrates all breaking changes for `@drivenets/design-system` v1. Runs all transforms automatically — each one only touches files importing the relevant component.

**Included transforms:**

| Transform                     | What it does                                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| `DsButton-legacy-migration`   | Migrates legacy `DsButton` (no `design` prop) to v3 API                                            |
| `DsButton-v12-migration`      | Migrates `DsButton` with `design="v1.2"` to v3 API                                                 |
| `DsButtonV3-rename-migration` | Renames `DsButtonV3` to `DsButton` in JSX and imports                                              |
| `type-imports-migration`      | Renames types: `DsButtonUnifiedProps` → `DsButtonProps`, `DsButtonV3Props` → `DsButtonProps`, etc. |

## Prop Mapping Reference

### DsButton Legacy → V3

| Before                 | After                       |
| ---------------------- | --------------------------- |
| `schema="primary"`     | _(removed, default)_        |
| `schema="secondary"`   | `variant="secondary"`       |
| `schema="error"`       | `color="negative"`          |
| `variant="filled"`     | _(removed, default)_        |
| `variant="ghost"`      | `variant="tertiary"`        |
| `variant="borderless"` | `variant="tertiary"` + TODO |
| `variant="round"`      | TODO (no equivalent)        |
| `variant="dashed"`     | TODO (no equivalent)        |
| `contentClassName`     | TODO (removed)              |

### DsButton v1.2 → V3

| Before                         | After                        |
| ------------------------------ | ---------------------------- |
| `design="v1.2"`                | _(removed)_                  |
| `buttonType="primary"`         | _(removed, default)_         |
| `buttonType="secondary"`       | `variant="secondary"`        |
| `buttonType="secondary-light"` | `variant="secondary"` + TODO |
| `buttonType="tertiary"`        | `variant="tertiary"`         |
| `variant="filled"`             | _(removed, default)_         |
| `variant="ghost"`              | `variant="tertiary"`         |
| `variant="danger"`             | `color="negative"`           |
| `variant="dark"`               | `onDark`                     |
| `contentClassName`             | TODO (removed)               |
