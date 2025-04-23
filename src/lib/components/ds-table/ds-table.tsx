import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useVirtualizer, type VirtualItem } from '@tanstack/react-virtual';
import classnames from 'classnames';
import * as React from 'react';

import DsIcon from '../ds-icon/ds-icon';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './core-table';

import Button from '../ds-button/ds-button';
import styles from './ds-table.module.scss';
import type { DataTableProps } from './ds-table.types';

/**
 * Design system Table component
 */
const DsTable = <TData, TValue>({
  columns,
  data,
  virtualized = false,
  virtualizedOptions = {
    estimateSize: 48,
    overscan: 10,
  },
  pagination = true,
  pageSize = 10,
  className,
  onRowClick,
  emptyState,
  stickyHeader = true,
  bordered = true,
  dense = false,
  fullWidth = true,
  highlightOnHover = true,
  expandable = false,
  renderExpandedRow,
  filterElement,
  onTableCreated,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  React.useEffect(() => {
    if (onTableCreated) {
      onTableCreated(table);
    }
  }, [table, onTableCreated]);

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => virtualizedOptions.estimateSize || 48,
    overscan: virtualizedOptions.overscan || 10,
  });

  const toggleRowExpanded = (rowId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  return (
    <div className={classnames(styles.container, className)}>
      {filterElement}
      <div
        ref={tableContainerRef}
        className={classnames(styles.dataTableContainer, virtualized && styles.virtualized)}
      >
        {virtualized ? (
          <div
            className={styles.virtualRowContainer}
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            <table className={classnames(styles.table, !bordered && styles.tableNoBorder)}>
              <thead className={classnames(stickyHeader && styles.stickyHeader)}>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr
                    key={headerGroup.id}
                    className={classnames(styles.headerRow, !bordered && styles.headerRowNoBorder)}
                  >
                    {expandable && <th className={styles.expandColumn}></th>}
                    {headerGroup.headers.map(header => {
                      return (
                        <th
                          key={header.id}
                          className={classnames(
                            styles.headerCell,
                            dense ? styles.headerCellDense : styles.headerCellStandard,
                            header.column.getCanSort() && styles.sortableHeader,
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            width: header.getSize(),
                            minWidth: header.getSize(),
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <div className={styles.headerSortContainer}>
                              <div>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </div>
                              {header.column.getCanSort() && (
                                <div>
                                  {{
                                    asc: (
                                      <DsIcon name="arrow_upward" className={styles.pageButtonIcon} />
                                    ),
                                    desc: (
                                      <DsIcon name="arrow_downward" className={styles.pageButtonIcon} />
                                    ),
                                  }[header.column.getIsSorted() as string] ?? (
                                    <DsIcon
                                      name="unfold_more"
                                      className={styles.pageButtonIcon}
                                      style={{ opacity: 0.5 }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
                  const row = rows[virtualRow.index];
                  const isExpanded = expandable && expandedRows[row.id];

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        data-state={row.getIsSelected() && 'selected'}
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                          position: 'absolute',
                          width: '100%',
                        }}
                        className={classnames(
                          styles.virtualizedRow,
                          onRowClick && styles.clickableRow,
                          highlightOnHover && styles.highlightHoverRow,
                          !bordered && styles.rowNoBorder,
                        )}
                        onClick={() => onRowClick && onRowClick(row.original)}
                      >
                        {expandable && (
                          <td className={classnames(styles.tableCell, styles.cellButton)}>
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                toggleRowExpanded(row.id);
                              }}
                              className={styles.expandToggleButton}
                            >
                              {isExpanded ? (
                                <DsIcon name="arrow_drop_down" className={styles.pageButtonIcon} />
                              ) : (
                                <DsIcon name="arrow_right" className={styles.pageButtonIcon} />
                              )}
                            </Button>
                          </td>
                        )}
                        {row.getVisibleCells().map(cell => (
                          <td
                            key={cell.id}
                            className={classnames(
                              styles.tableCell,
                              dense ? styles.cellDense : styles.cellStandard,
                            )}
                            style={{
                              width: cell.column.getSize(),
                              minWidth: cell.column.getSize(),
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {isExpanded && renderExpandedRow && (
                        <tr
                          style={{
                            transform: `translateY(${virtualRow.start + virtualRow.size}px)`,
                            position: 'absolute',
                            width: '100%',
                          }}
                          className={styles.expandedRow}
                        >
                          <td colSpan={row.getVisibleCells().length + 1} className={styles.tableCell}>
                            {renderExpandedRow(row.original)}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Table
            className={classnames(fullWidth && styles.fullWidth, !bordered && styles.tableNoBorder)}
          >
            <TableHeader className={classnames(stickyHeader && styles.stickyHeader)}>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow
                  key={headerGroup.id}
                  className={classnames(!bordered && styles.headerRowNoBorder)}
                >
                  {expandable && <TableHead className={styles.expandColumn}></TableHead>}
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead
                        key={header.id}
                        className={classnames(
                          dense ? styles.headerCellDense : styles.headerCellStandard,
                          header.column.getCanSort() && styles.sortableHeader,
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          width: header.getSize(),
                          minWidth: header.getSize(),
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <div className={styles.headerSortContainer}>
                            <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                            {header.column.getCanSort() && (
                              <div>
                                {{
                                  asc: <DsIcon name="arrow_upward" className={styles.pageButtonIcon} />,
                                  desc: (
                                    <DsIcon name="arrow_downward" className={styles.pageButtonIcon} />
                                  ),
                                }[header.column.getIsSorted() as string] ?? (
                                  <DsIcon
                                    name="unfold_more"
                                    className={styles.pageButtonIcon}
                                    style={{ opacity: 0.5 }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => {
                  const isExpanded = expandable && expandedRows[row.id];

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && 'selected'}
                        className={classnames(
                          onRowClick && styles.clickableRow,
                          highlightOnHover && styles.highlightHoverRow,
                          !bordered && styles.rowNoBorder,
                        )}
                        onClick={() => onRowClick && onRowClick(row.original)}
                      >
                        {expandable && (
                          <TableCell className={styles.cellButton}>
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                toggleRowExpanded(row.id);
                              }}
                              className={styles.expandToggleButton}
                            >
                              {isExpanded ? (
                                <DsIcon name="arrow_drop_down" className={styles.pageButtonIcon} />
                              ) : (
                                <DsIcon name="arrow_right" className={styles.pageButtonIcon} />
                              )}
                            </Button>
                          </TableCell>
                        )}
                        {row.getVisibleCells().map(cell => (
                          <TableCell
                            key={cell.id}
                            className={classnames(dense ? styles.cellDense : styles.cellStandard)}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                      {isExpanded && renderExpandedRow && (
                        <TableRow className={styles.expandedRow}>
                          <TableCell colSpan={row.getVisibleCells().length + 1}>
                            {renderExpandedRow(row.original)}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (expandable ? 1 : 0)}
                    className={styles.emptyState}
                  >
                    {emptyState || 'No results.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default DsTable;
