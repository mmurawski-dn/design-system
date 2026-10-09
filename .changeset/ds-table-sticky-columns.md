---
'@drivenets/design-system': minor
---

Add sticky columns to `DsTable`: `stickyColumns` keeps chosen columns at the left or right edge while the table scrolls horizontally, with `onStickyColumnsChange` for controlled state. Selection, expansion, reorder and row actions columns are always sticky. The table now scrolls both axes in one container, so the vertical scrollbar stays at the visible right edge, and expanded row content stays within the visible area.
