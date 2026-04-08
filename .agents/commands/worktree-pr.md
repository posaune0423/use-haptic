# Worktree PR Command

Migrate changes from a worktree to a new branch cut from main (or a specified base branch), commit with proper messages, push, and create a pull request.

## Arguments

$ARGUMENTS = `[branch-name] [base-branch=main]`

- **branch-name** (optional): Name of the branch to create (e.g., `feat/add-buy-agent`)
- **base-branch** (optional): Base branch to cut from (default: `main`)

### Auto-generated Branch Name (when branch-name is omitted)

When branch-name is omitted, the branch name is automatically determined from the **change analysis in Step 2**.

#### Auto-naming Rules

1. Determine the dominant change type: `feat` / `fix` / `refactor` / `chore` / `docs` / `test` / `perf` / `style`
2. Determine the primary scope (see Scope Guidelines)
3. Generate a descriptive slug (English, kebab-case, 3-5 words) summarizing the changes
4. Format: `${type}/${slug}`

#### Auto-naming Examples

| Changes                         | Auto-generated branch name     |
| ------------------------------- | ------------------------------ |
| Add purchase agent feature      | `feat/add-purchase-agent`      |
| Add purchase table to DB schema | `feat/add-purchase-schema`     |
| Refactor notification logic     | `refactor/notification-logic`  |
| Fix CI workflow                 | `fix/ci-workflow`              |
| Fix API endpoint bug            | `fix/api-endpoint-error`       |
| Add unit tests                  | `test/add-purchase-unit-tests` |
| Update Docker configuration     | `chore/update-docker-config`   |

---

## Steps

Do exactly this, non-interactively, from repo root.

### 1. Assess Current State

Run the following commands **in parallel** to fully understand the current state:

```bash
# Worktree info
git worktree list

# Current branch
git branch --show-current

# Full picture of changes (staged + unstaged + untracked)
git status --porcelain=v1

# Committed changes ahead of origin/base-branch
git log origin/${base-branch}..HEAD --oneline 2>/dev/null || echo "No commits ahead"

# Diff stat against origin/base-branch
git diff origin/${base-branch} --stat 2>/dev/null

# Fetch latest from remote
git fetch origin ${base-branch}
```

### 2. Analyze Changes

1. Analyze **all changes** by combining `git diff origin/${base-branch}` (committed + unstaged) with untracked files
2. Read the content of each changed file and determine:
   - Functional grouping (which responsibility/layer each change belongs to)
   - Intent of each group (feat / fix / refactor / chore / docs / test / style / perf)
   - Appropriate scope (e.g., db, api, web, infra, auth, etc.)
3. Plan the commit strategy (following the format described below)
4. **If branch-name was omitted**: Determine the branch name from the analysis above using the auto-naming rules
   - Generate `${type}/${slug}` from the most dominant type and scope across all changes
   - If an active spec exists under `.kiro/specs/`, reflect its feature name in the slug

### 3. Create Branch and Migrate Changes

**Case A: Uncommitted changes only (HEAD is the same as origin/${base-branch}, or no commits ahead)**

```bash
# Stash all changes
git stash push -u -m "worktree-pr: temp stash for ${branch-name}"

# Create new branch from origin/${base-branch}
git checkout -b ${branch-name} origin/${base-branch}

# Apply stashed changes
git stash pop
```

**Case B: Committed changes exist**

```bash
# Record the range of committed changes
FIRST_COMMIT=$(git log origin/${base-branch}..HEAD --reverse --format='%H' | head -1)
LAST_COMMIT=$(git rev-parse HEAD)

# Stash uncommitted changes if any
git stash push -u -m "worktree-pr: temp stash for ${branch-name}" 2>/dev/null

# Create new branch from origin/${base-branch}
git checkout -b ${branch-name} origin/${base-branch}

# Cherry-pick committed changes
git cherry-pick ${FIRST_COMMIT}^..${LAST_COMMIT}
# If cherry-pick conflicts: fall back to soft reset for manual commit
# git reset --soft origin/${base-branch}

# Apply stash if present
git stash pop 2>/dev/null
```

**Case C: Patch-based migration (fallback when Case B conflicts)**

```bash
# Create patch of all diffs against origin/${base-branch}
git diff origin/${base-branch} > /tmp/worktree-pr.patch

# Archive untracked files
git ls-files --others --exclude-standard -z | xargs -0 tar czf /tmp/worktree-pr-untracked.tar.gz 2>/dev/null

# Create new branch
git checkout -b ${branch-name} origin/${base-branch}

# Apply patch
git apply /tmp/worktree-pr.patch
tar xzf /tmp/worktree-pr-untracked.tar.gz 2>/dev/null

# Cleanup
rm -f /tmp/worktree-pr.patch /tmp/worktree-pr-untracked.tar.gz
```

### 4. Commit in Logical Groups

Based on the analysis from Step 2, commit changes in logical groups. **Follow `.cursor/rules/commit-style.mdc`** for format, type/emoji, order, scope, and commands.

### 5. Push

```bash
git push -u origin ${branch-name}
```

### 6. Create PR

Create a pull request using `gh pr create`.

#### PR Title

- If there is only 1 commit: use that commit message as-is
- If there are multiple commits: craft a title that summarizes all changes
- Format: `${emoji} ${type}(${scope}): ${summary}` (same format as commit messages)

#### PR Body Template

```markdown
## Summary

<1-3 bullet points summarizing the overall changes>

## Changes

<List major changes by file/module>

### ${scope1}

- ${change1}
- ${change2}

### ${scope2}

- ${change3}

## Test plan

- [ ] <test item 1>
- [ ] <test item 2>
```

#### Command

```bash
gh pr create \
  --base ${base-branch} \
  --title "${pr_title}" \
  --body "$(cat <<'EOF'
${pr_body}
EOF
)"
```

### 7. Final Verification

```bash
# Verify no remaining changes
git status --porcelain=v1

# Display PR URL
gh pr view --web 2>/dev/null || gh pr view
```

Report the PR URL to the user as the final output.

---

## Important Notes

- Follow `.gitignore` strictly. Additionally, never stage `.env`, `.cursor/**` (except commands)
- Never commit files containing credentials or secrets
- If a conflict occurs, report the situation to the user and ask for instructions
- Default base-branch to `main` when omitted
- Auto-generate branch-name from change analysis when omitted (see auto-naming rules)
- If the branch-name (specified or auto-generated) already exists, report an error and suggest an alternative name
