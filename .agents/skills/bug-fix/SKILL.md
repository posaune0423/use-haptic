---
name: bug-fix
description: Diagnose and fix implementation errors from stack traces, identify root cause, apply minimum effective fixes, and validate with lint/format/build/test loops until green. Use for debugging and defect resolution tasks.
---

# Bug Fix

## Steps

1. Read the error and stack trace carefully, then inspect the related files and code to identify a concrete root cause.
2. If root cause cannot be identified because required information is missing, report exactly what is missing to the developer.
3. Choose the minimum but effective method to solve that root cause.
4. Apply the fix.
5. Run lint, format, build, and test (when available), then verify all tests pass.
6. If tests fail, use the new failure as input and restart this flow from step 1.
