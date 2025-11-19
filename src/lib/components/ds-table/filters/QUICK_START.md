# Quick Start: Table Filters

Get started with table filters in 3 steps!

## Step 1: Define Your Filters (config file)

Create a config file for your table's filters:

```typescript
// my-table-filters.config.tsx
import { createCheckboxFilterAdapter, createDualRangeFilterAdapter } from '../filters';

// Define your data type
export interface MyData {
  id: string;
  status: string;
  count: number;
}

// Create filter adapters
export const statusFilter = createCheckboxFilterAdapter<MyData>({
  id: 'status',
  label: 'Status',
  items: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ],
});

export const countFilter = createDualRangeFilterAdapter<MyData>({
  id: 'count',
  label: 'Count',
  fields: { count: 'Count' },
});

// Export all filters
export const myFilters = [statusFilter, countFilter];
```

## Step 2: Use in Your Component/Story

```typescript
import { useTableFilters } from '../filters/hooks/use-table-filters';
import { myFilters, MyData } from './my-table-filters.config';

function MyTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    columnFilters,
    filterChips,
    filterNavItems,
    enhancedColumns,
    handlers,
    renderFilterContent,
  } = useTableFilters(myFilters, baseColumns);

  return (
    <>
      {/* Filter button */}
      <DsButton onClick={() => setIsModalOpen(true)}>
        <DsIcon icon="filter_list" />
      </DsButton>

      {/* Chips */}
      {filterChips.length > 0 && (
        <DsChipGroup
          items={filterChips}
          onClearAll={handlers.clearAll}
          onItemDelete={handlers.deleteChip}
        />
      )}

      {/* Table */}
      <DsTable
        columns={enhancedColumns}
        columnFilters={columnFilters}
        data={myData}
      />

      {/* Filter modal */}
      <TableFilterModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        filterNavItems={filterNavItems}
        onApply={handlers.applyFilters}
        onClearAll={handlers.clearAll}
      >
        {(selectedFilter) => renderFilterContent(selectedFilter)}
      </TableFilterModal>
    </>
  );
}
```

## Step 3: Add More Filters (Easy!)

Want to add a new filter? Just add one adapter to your config:

```typescript
// my-table-filters.config.tsx

export const categoryFilter = createCheckboxFilterAdapter<MyData>({
  id: 'category',
  label: 'Category',
  items: [
    { value: 'type1', label: 'Type 1' },
    { value: 'type2', label: 'Type 2' },
  ],
});

export const myFilters = [
  statusFilter,
  countFilter,
  categoryFilter, // ← Added!
];
```

**Done!** No changes needed in your component.

---

## Available Filter Types

### Checkbox Filter (Multi-select)

```typescript
createCheckboxFilterAdapter<DataType>({
  id: 'columnName',
  label: 'Display Label',
  items: [
    { value: 'val1', label: 'Label 1' },
    { value: 'val2', label: 'Label 2' },
  ],
  renderer?: (item) => <CustomComponent />,      // Optional
  chipLabelTemplate?: (item) => `Custom: ${item.label}`, // Optional
  cellRenderer?: (value) => <CustomCell />,      // Optional
});
```

### Dual-Range Filter (Numeric ranges)

```typescript
createDualRangeFilterAdapter<DataType>({
  id: 'columnName',
  label: 'Display Label',
  fields: {
    field1: 'Field 1 Label',
    field2: 'Field 2 Label',
  },
  formatNumber?: (num) => num.toFixed(2),        // Optional
});
```

### Custom Filter (Full control)

```typescript
createCustomFilterAdapter<DataType, FilterValueType>({
  id: 'columnName',
  label: 'Display Label',
  initialValue: { /* your initial state */ },
  filterFn: (row, columnId, filterValue) => boolean,
  toChips: (value) => FilterChipItem[],
  fromChip: (chip, currentValue) => newValue,
  getActiveCount: (value) => number,
  hasActiveFilters: (value) => boolean,
  renderFilter: (value, onChange) => ReactNode,
  cellRenderer?: (value) => ReactNode,           // Optional
});
```

---

## Common Patterns

### Custom Rendering for Checkbox Items

```typescript
const statusFilter = createCheckboxFilterAdapter({
  id: 'status',
  label: 'Status',
  items: statusItems,
  renderer: (item) => (
    <DsStatusBadge icon={getIcon(item.value)} status={item.value} />
  ),
  cellRenderer: (value) => (
    <DsStatusBadge icon={getIcon(value)} status={value} />
  ),
});
```

### Multi-Field Range Filter

```typescript
const performanceFilter = createDualRangeFilterAdapter({
  id: 'performance',
  label: 'Performance',
  fields: {
    cpu: 'CPU Usage (%)',
    memory: 'Memory (GB)',
    disk: 'Disk I/O (MB/s)',
  },
});
```

### Complex Custom Filter

```typescript
const lastEditedFilter = createCustomFilterAdapter({
  id: 'lastEdited',
  label: 'Last Edited',
  initialValue: {
    editors: [],
    startDate: undefined,
    endDate: undefined,
  },
  filterFn: (row, columnId, filterValue) => {
    // Your complex logic
  },
  // ... other methods
  renderFilter: (value, onChange) => (
    <div>
      <EditorMultiSelect
        selected={value.editors}
        onChange={(editors) => onChange({ ...value, editors })}
      />
      <DateRangePicker
        from={value.startDate}
        to={value.endDate}
        onChange={(range) => onChange({ ...value, ...range })}
      />
    </div>
  ),
});
```

---

## Tips

1. **Organize by table**: Create one config file per table (e.g., `workflow-filters.config.tsx`)
2. **Reuse adapters**: If multiple tables use similar filters, export the adapter factory calls
3. **Type everything**: Always provide the `<DataType>` generic for type safety
4. **Test adapters**: Each adapter is independently testable
5. **Read the docs**: See [USAGE_GUIDE.md](./USAGE_GUIDE.md) for detailed examples

---

## What You Get

✅ Automatic chip generation  
✅ Automatic filter nav items with counts  
✅ Automatic column enhancement  
✅ Automatic state management  
✅ Type-safe filtering  
✅ Plug-and-play new filters

---

## Need Help?

- **Usage examples**: [USAGE_GUIDE.md](./USAGE_GUIDE.md)
- **Architecture overview**: [README.md](./README.md)
- **Before/after comparison**: [COMPARISON.md](./COMPARISON.md)
- **Example implementation**: `stories/filters-panel.stories.tsx` and
  `stories/filters-panel/workflow-filters.config.tsx`
