---
name: final-check
description: Run final quality gates (lint, format, typecheck), fix root causes with minimal changes, and repeat until no errors or warnings remain. Use before completion or handoff.
---

# Final Check

## Steps

1. Run lint, format, and typecheck, then verify no errors or warnings exist.
2. If any errors or warnings are found, identify the root cause and apply the minimum effective fix.
3. Re-run lint, format, and typecheck after each fix.
4. Repeat steps 2 and 3 until all errors and warnings are cleared.
