# Table Filters Architecture

A plug-and-play filter system for tables using the **Filter Adapter Pattern**.

## Problem

Adding new table filters required:

- Scattered state management (`useState` for each filter)
- Repetitive boilerplate (chip generation, column filtering, nav items)
- Manual wiring in the story/component
- Difficult to maintain as filters grow

## Solution

The **Filter Adapter Pattern** centralizes all filter concerns into reusable adapters:

```
┌─────────────────────────────────────────────────────────────┐
│                    Filter Adapter                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   State     │  │  Filter Fn   │  │  Rendering   │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Chips     │  │  Nav Items   │  │ Cell Render  │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  useTableFilters Hook
                            ↓
              ┌─────────────────────────────┐
              │  Story/Component (Simple!)  │
              └─────────────────────────────┘
```

## Structure

```
filters/
├── README.md                    ← You are here
├── USAGE_GUIDE.md              ← How to use the system
├── types/
│   └── filter-adapter.types.ts  ← Core interfaces
├── adapters/
│   ├── checkbox-filter-adapter.tsx      ← Generic checkbox filter
│   ├── dual-range-filter-adapter.tsx    ← Generic dual-range filter
│   ├── custom-filter-adapter.ts        ← For app-specific filters
│   └── index.ts
├── hooks/
│   └── use-table-filters.ts      ← Orchestration hook
└── index.ts
```

## Core Concepts

### 1. Filter Adapter

An adapter encapsulates all filter behavior:

```typescript
interface FilterAdapter<TData, TFilterValue> {
  id: string; // Column ID
  label: string; // Display label
  initialValue: TFilterValue; // Default state
  columnFilterFn: (row, columnId, filterValue) => boolean;
  cellRenderer?: (value) => ReactNode;
  toChips: (value) => FilterChipItem[];
  fromChip: (chip, currentValue) => TFilterValue;
  getActiveCount: (value) => number;
  hasActiveFilters: (value) => boolean;
  reset: () => TFilterValue;
  renderFilter: (value, onChange) => ReactNode;
}
```

### 2. Factory Functions

Create adapters easily:

- **`createCheckboxFilterAdapter`**: Multi-select checkbox filters
- **`createDualRangeFilterAdapter`**: Numeric range filters (with multiple fields)
- **`createCustomFilterAdapter`**: Full control for complex scenarios

### 3. `useTableFilters` Hook

Orchestrates multiple adapters:

```typescript
const {
  columnFilters, // For TanStack Table
  filterChips, // For DsChipGroup
  filterNavItems, // For FilterModal navigation
  enhancedColumns, // Columns with filter functions
  handlers, // { applyFilters, clearAll, deleteChip, updateFilter }
  renderFilterContent, // Render function for modal
} = useTableFilters(filterAdapters, baseColumns);
```

## Usage Example

**Step 1**: Define filters in a config file

```typescript
// workflow-filters.config.tsx
export const statusFilterAdapter = createCheckboxFilterAdapter({ ... });
export const runningCompletedFilterAdapter = createDualRangeFilterAdapter({ ... });
export const workflowFilters = [statusFilterAdapter, runningCompletedFilterAdapter];
```

**Step 2**: Use in your component

```typescript
const { columnFilters, filterChips, filterNavItems, enhancedColumns, handlers, renderFilterContent } =
  useTableFilters(workflowFilters, baseColumns);

return (
  <>
    <DsChipGroup items={filterChips}
onClearAll={handlers.clearAll}
/>
< DsTable
columns = { enhancedColumns }
columnFilters = { columnFilters }
/>
< TableFilterModal
filterNavItems = { filterNavItems }
onApply = { handlers.applyFilters } >
  {(selectedFilter)
=>
<FilterRenderer filterConfig = { renderFilterContent(selectedFilter) }
/>}
< /TableFilterModal>
< />
)
;
```

**That's it!** Add a new filter by adding one adapter to the config array.

## Benefits

- ✅ **Plug-and-Play**: Add filters by adding to array
- ✅ **No Boilerplate**: Hook handles state, chips, nav items
- ✅ **Type-Safe**: Full TypeScript support
- ✅ **Reusable**: Generic adapters work across tables
- ✅ **Extensible**: Custom adapters for complex scenarios
- ✅ **Testable**: Each adapter is independently testable

## Documentation

See [USAGE_GUIDE.md](./USAGE_GUIDE.md) for detailed examples and API reference.

## Example: Adding a New Filter

Want to add a "Version" filter? Add one adapter:

```typescript
export const versionFilterAdapter = createCheckboxFilterAdapter({
  id: 'version',
  label: 'Version',
  items: [
    { value: 'v1', label: 'Version 1' },
    { value: 'v2', label: 'Version 2' },
  ],
});

export const workflowFilters = [
  statusFilterAdapter,
  runningCompletedFilterAdapter,
  versionFilterAdapter, // ← Added!
];
```

Done! The hook automatically handles everything else.
