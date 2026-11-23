# Sprint autopilot map

Scheduling rule (Michal, 2026-11-23): Slot is a day (`YYYY-MM-DD`), not am/pm. Any run on or after that day picks the ticket up. Spread tickets evenly over the remaining weekdays, today included.

Last Slack report: D0A39B8F3CG 1795435832.930089

## DAP 2026 S16 (ends 2026-11-30)

| Ticket | Type | Jira status | Slot | Pinned | State | Branch | PR | CI | Slack | Notes | Updated |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AR-83900 | Bug | In Review | 2026-11-20 |  | pr-open | claude/AR-83900-alert-banner-action-buttons | [#915](https://github.com/drivenets/design-system/pull/915) | green | posted | 2026-11-20: Jira In Progress transition needs Affects versions + Components (autopilot may not set fields), and Open has no In Review transition, so left Open; asked Michal. 2026-11-20 Michal: set the fields and moved it to In Progress; autopilot moved it to In Review. Docs/Code Connect only, `skip changelog`. Commit author email is empty (git identity override slip); harmless if squash-merged. 2026-11-23: no reviews yet; branch behind main but no conflict. 2026-11-23 12:10: unchanged. | 2026-11-23 12:10 |
| AR-99359 | Bug | In Review | 2026-11-23 |  | pr-open | claude/AR-99359-drawer-header-buttons | [#925](https://github.com/drivenets/design-system/pull/925) | red (main) |  | 2026-11-23 Michal: schedule by day; picked up today. Close trigger is now a small tertiary DsButtonV3 plus `locale.close`; changeset added. Local browser/docs tests ran with the preinstalled Chromium 1243 (cdn.playwright.dev blocked); visual tests not run (no drawer visual stories). Found DsStack default-direction mismatch (CSS column vs JSDoc row), out of scope. CI: all green except "Check Unused Code and Dependencies" (`pnpm dedupe --check`), which also fails on main since #924; noted on the PR. Review request not posted yet (a check is red). 2026-11-23 12:10: still no reviews; `main` unchanged, dedupe check still red from main. The 09:00 run's question never reached Slack; asked in the DM now (`1 post` / `1 wait`). | 2026-11-23 12:10 |
| AR-99368 | Bug | Open | 2026-11-25 |  | planned |  |  |  |  |  | 2026-11-23 08:30 |
| AR-99373 | Bug | Open | 2026-11-27 |  | planned |  |  |  |  |  | 2026-11-23 08:30 |
| AR-116576 | Story | In Progress |  |  | done-elsewhere |  |  |  |  | Not in To Do; PRs #912–#914 by Michal | 2026-11-20 06:15 |
| AR-108868 | Bug | In Review |  |  | done-elsewhere |  |  |  |  | PR #907 by Michal | 2026-11-20 06:15 |
| AR-99415 | Bug | Closed |  |  | done-elsewhere |  |  |  |  |  | 2026-11-20 06:15 |
| AR-99446 | Bug | Closed |  |  | done-elsewhere |  |  |  |  |  | 2026-11-20 06:15 |
| AR-99448 | Bug | Closed |  |  | done-elsewhere |  |  |  |  |  | 2026-11-20 06:15 |
| AR-99451 | Bug | Closed |  |  | done-elsewhere |  |  |  |  |  | 2026-11-20 06:15 |
| AR-99455 | Bug | Closed |  |  | done-elsewhere |  |  |  |  |  | 2026-11-20 06:15 |
| AR-99458 | Bug | Closed |  |  | done-elsewhere |  |  |  |  |  | 2026-11-20 06:15 |
| AR-99459 | Bug | Closed |  |  | done-elsewhere |  |  |  |  |  | 2026-11-20 06:15 |
| AR-103374 | Bug | Closed |  |  | done-elsewhere |  |  |  |  |  | 2026-11-20 06:15 |
| AR-105192 | Bug | Closed |  |  | done-elsewhere |  |  |  |  |  | 2026-11-20 06:15 |
