# Before vs After: Filter Adapter Pattern

## Before: Manual Filter Management (258 lines in story)

### Story Code

```typescript
export const FiltersPanel: Story = {
  render: function Render(args) {
    // 🔴 Manual state for each filter
    const [isOpen, setIsOpen] = useState(false);
    const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
    const [modalFilters, setModalFilters] = useState([
      { id: 'status', label: 'Status', count: 0 },
      { id: 'runningCompleted', label: 'Running/Completed', count: 0 },
    ]);
    const [filterChips, setFilterChips] = useState<FilterChipItem[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState(statusItems);
    const [runningRange, setRunningRange] = useState({});
    const [completedRange, setCompletedRange] = useState({});

    // 🔴 Manual icon mapping
    const getStatusIcon = (status: DsStatus): IconType => {
      switch (status) {
        case 'active': return 'check_circle';
        case 'running': return 'change_circle';
        // ... 7 more cases
      }
    };

    // 🔴 Manual rendering
    const renderStatus = (status: DsStatus) => {
      const icon = getStatusIcon(status);
      return <DsStatusBadge icon={icon} status={status} size="small" />;
    };

    // 🔴 Manual column definitions with filter functions
    const statusColumnDef: ColumnDef<Workflow> = {
      accessorKey: 'status',
      header: 'Status',
      filterFn: (row, columnId, filterValue) =>
        filterValue.includes(row.getValue(columnId)),
      cell: (info) => renderStatus(info.getValue() as DsStatus),
    };

    const runningCompletedColumnDef: ColumnDef<Workflow> = {
      accessorKey: 'runningCompleted',
      header: 'Running/completed',
      filterFn: (row, columnId, filterValue) => {
        // ... 15 lines of range logic
      },
      cell: (info) => {
        const value = info.getValue() as { running: number; completed: number };
        return `${value.running}/${value.completed}`;
      },
    };

    // 🔴 Manually map columns
    const tableColumns = args.columns.map((col) => {
      const accessorKey = (col as { accessorKey: string }).accessorKey;
      if (accessorKey === 'status') return statusColumnDef;
      if (accessorKey === 'runningCompleted') return runningCompletedColumnDef;
      return col;
    });

    // 🔴 Manual handleApply (60+ lines)
    const handleApply = () => {
      const filters: ColumnFilter[] = [];
      const chips: FilterChipItem[] = [];

      // Handle status filter
      if (selectedStatuses.length < statusItems.length) {
        filters.push({
          id: 'status',
          value: selectedStatuses.map((s) => s.value),
        });
        chips.push(...selectedStatuses.map(status => ({
          id: `status_${status.value}`,
          label: `Status: ${status.label}`,
          metadata: { key: 'status', value: status.value },
        })));
      }

      // Handle running/completed ranges (30+ lines)
      const hasRunningFilter = runningRange.from !== undefined || runningRange.to !== undefined;
      const hasCompletedFilter = completedRange.from !== undefined || completedRange.to !== undefined;

      if (hasRunningFilter || hasCompletedFilter) {
        filters.push({
          id: 'runningCompleted',
          value: {
            runningFrom: runningRange.from,
            runningTo: runningRange.to,
            completedFrom: completedRange.from,
            completedTo: completedRange.to,
          },
        });

        if (hasRunningFilter) {
          // Generate chip for running
        }
        if (hasCompletedFilter) {
          // Generate chip for completed
        }
      }

      setColumnFilters(filters);
      setFilterChips(chips);
      setIsOpen(false);
    };

    // 🔴 Manual handleClearAll
    const handleClearAll = () => {
      setSelectedStatuses(statusItems);
      setRunningRange({});
      setCompletedRange({});
      setColumnFilters([]);
      setFilterChips([]);
      setIsOpen(false);
    };

    // 🔴 Manual handleFilterDelete (50+ lines)
    const handleFilterDelete = (filter: FilterChipItem) => {
      if (filter.metadata?.key === 'status') {
        // ... 15 lines
      } else if (filter.metadata?.key === 'running') {
        // ... 20 lines
      } else if (filter.metadata?.key === 'completed') {
        // ... 20 lines
      }
    };

    // 🔴 Manual filter content rendering
    return (
      <TableFilterModal>
        {(selectedFilter) => {
          if (selectedFilter.id === 'status') {
            return <CheckboxFilter ... />;
          }
          if (selectedFilter.id === 'runningCompleted') {
            return (
              <div>
                <RangeFilter label="Running" ... />
                <RangeFilter label="Completed" ... />
              </div>
            );
          }
          return JSON.stringify(selectedFilter);
        }}
      </TableFilterModal>
    );
  },
};
```

### Problems

- ❌ 258 lines for 2 filters
- ❌ 8+ `useState` calls
- ❌ Repetitive boilerplate for each filter
- ❌ Manual chip generation/deletion logic
- ❌ Manual column mapping
- ❌ Hard to add new filters
- ❌ Scattered logic across the component

---

## After: Filter Adapter Pattern (52 lines in story)

### Configuration File (workflow-filters.config.tsx)

```typescript
// ✅ Declarative filter definitions
export const statusFilterAdapter = createCheckboxFilterAdapter({
  id: 'status',
  label: 'Status',
  items: statusItems,
  renderer: (item) => renderStatusBadge(item.value),
  chipLabelTemplate: (item) => `Status: ${item.label}`,
  cellRenderer: (value) => renderStatusBadge(value as DsStatus),
});

export const runningCompletedFilterAdapter = createDualRangeFilterAdapter({
  id: 'runningCompleted',
  label: 'Running/Completed',
  fields: { running: 'Running', completed: 'Completed' },
  formatNumber: (num) => num.toLocaleString('en-US'),
});

export const workflowFilters = [statusFilterAdapter, runningCompletedFilterAdapter];
```

### Story Code

```typescript
export const FiltersPanel: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(false);

    // ✅ One hook to rule them all
    const {
      columnFilters,
      filterChips,
      filterNavItems,
      enhancedColumns,
      handlers,
      renderFilterContent,
    } = useTableFilters(workflowFilters, args.columns);

    return (
      <div>
        <DsButton onClick={() => setIsOpen(true)}>
          <DsIcon icon="filter_list" />
        </DsButton>

        {filterChips.length > 0 && (
          <DsChipGroup
            items={filterChips}
            onClearAll={() => { handlers.clearAll(); setIsOpen(false); }}
            onFilterDelete={handlers.deleteChip}
          />
        )}

        <DsTable
          {...args}
          columns={enhancedColumns}
          columnFilters={columnFilters}
        />

        <TableFilterModal
          open={isOpen}
          onOpenChange={setIsOpen}
          filterNavItems={filterNavItems}
          onApply={() => { handlers.applyFilters(); setIsOpen(false); }}
          onClearAll={() => { handlers.clearAll(); setIsOpen(false); }}
        >
          {(selectedFilter) => (
            <FilterRenderer filterConfig={renderFilterContent(selectedFilter)} />
          )}
        </TableFilterModal>
      </div>
    );
  },
};
```

### Benefits

- ✅ **52 lines vs 258 lines** (80% reduction)
- ✅ **1 hook vs 8+ useState calls**
- ✅ **Centralized logic** in adapters
- ✅ **Automatic chip generation/deletion**
- ✅ **Automatic column enhancement**
- ✅ **Easy to add filters** (add to config array)
- ✅ **Type-safe and testable**

---

## Adding a New Filter: Comparison

### Before (Manual)

1. Add `useState` for filter state
2. Add items to `modalFilters`
3. Create `ColumnDef` with `filterFn` and `cell`
4. Update `tableColumns` mapping
5. Update `handleApply` (15+ lines)
6. Update `handleClearAll`
7. Update `handleFilterDelete` (15+ lines)
8. Update filter rendering switch/if

**Estimated: 80-100 lines of code**

### After (Adapter Pattern)

1. Add filter adapter to config:

```typescript
export const categoryFilterAdapter = createCheckboxFilterAdapter({
  id: 'category',
  label: 'Category',
  items: categoryItems,
});

export const workflowFilters = [
  statusFilterAdapter,
  runningCompletedFilterAdapter,
  categoryFilterAdapter, // ← Added!
];
```

**Estimated: 5-10 lines of code**

---

## Custom Filter Example (Complex Scenario)

### Adding "Last Edited" Filter (Editor + Date Range)

```typescript
export const lastEditedFilterAdapter = createCustomFilterAdapter({
  id: 'lastEdited',
  label: 'Last Edited',
  initialValue: { editors: [], dateRange: {} },

  filterFn: (row, columnId, filterValue) => {
    const { editor, timestamp } = row.getValue(columnId);
    // Check editor and date range
    return matchesEditor && matchesDateRange;
  },

  toChips: (value) => [
    // Generate chips for editors and date range
  ],

  fromChip: (chip, currentValue) => {
    // Remove chip effect
  },

  getActiveCount: (value) => {
    // Calculate count
  },

  hasActiveFilters: (value) => {
    // Check if active
  },

  renderFilter: (value, onChange) => (
    <div>
      <EditorMultiSelect ... />
      <DateRangePicker ... />
    </div>
  ),

  cellRenderer: (value) => (
    <div>
      <div>{value.editor}</div>
      <div>{formatDate(value.timestamp)}</div>
    </div>
  ),
});

// Add to array
export const workflowFilters = [
  statusFilterAdapter,
  runningCompletedFilterAdapter,
  lastEditedFilterAdapter, // ← Complex filter, plug and play!
];
```

**No changes needed in the story file!**

---

## Summary

The Filter Adapter Pattern provides:

1. **80% code reduction** in story files
2. **Plug-and-play** filter addition
3. **Centralized, reusable** filter logic
4. **Type-safe** with full TypeScript support
5. **Scales easily** from simple to complex filters
6. **Consistent API** across all filters

### Code Organization

```
Before:
filters-panel.stories.tsx (258 lines)

After:
filters-panel.stories.tsx (52 lines)
workflow-filters.config.tsx (60 lines)
filters/
  ├── adapters/           ← Reusable across tables
  ├── hooks/              ← Orchestration
  └── types/              ← Type safety
```

The system is now **maintainable**, **scalable**, and **developer-friendly**! 🚀
