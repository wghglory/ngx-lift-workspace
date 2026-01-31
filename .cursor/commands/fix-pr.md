# Fix PR Review Comments - Plan Mode

Generates a fix plan for actionable code review comments from a GitHub PR. The author can review the plan and decide
whether to implement the fixes.

## Input

Branch name: `[BRANCH_NAME]`

## Steps

1. **Validate Branch**
   - Check current branch matches `[BRANCH_NAME]`
   - If mismatch, STOP with checkout instructions

2. **Fetch PR Data**
   - Search for PR: `repo:vcf/dsm-ui head:[BRANCH_NAME] is:pr`
   - Extract PR number
   - Fetch review comments and summaries
   - If no PR/reviews found, STOP with clear message

3. **Analyze Comments**
   - Categorize as **Actionable** (clear fix) or **Skipped** (questions, unclear, approvals)
   - Create organized list of actionable items with file paths and line numbers

4. **Generate Fix Plan**
   - For each actionable item:
     - Read affected file (if needed for context)
     - Analyze the issue and review comment
     - Propose specific fix following `.cursor/rules/` standards
     - Identify potential impact and risks
     - Estimate complexity (simple/moderate/complex)

   - Group fixes by file for better organization

5. **Present Fix Plan**
   - Display comprehensive plan with:
     - **PR Information**: PR number, title, branch
     - **Summary**: Total actionable items, skipped items
     - **Fix Plan by File**:
       - File path
       - Line number(s)
       - Review comment
       - Proposed fix description
       - Code snippet (before/after if applicable)
       - Complexity estimate
       - Potential risks/considerations
     - **Skipped Comments**: List with reasons
     - **Next Steps**: Instructions for author

6. **Author Decision**
   - Author reviews the plan
   - Author can:
     - Accept all fixes (implement manually or ask AI to implement specific ones)
     - Accept some fixes (cherry-pick which to implement)
     - Reject and handle manually
     - Ask for clarification on specific fixes

## Output Format

````markdown
# Fix Plan for PR #[NUMBER]: [PR_TITLE]

**Branch**: [BRANCH_NAME] **Total Actionable Items**: [COUNT] **Skipped Items**: [COUNT]

---

## Actionable Fixes

### 📁 [file1.ts]

#### Fix 1: [Brief description]

- **Line(s)**: [LINE_NUMBER]
- **Complexity**: [Simple/Moderate/Complex]
- **Review Comment**:
  > [Original review comment]
- **Proposed Fix**: [Detailed description of what needs to be changed and why]
- **Code Change**:

  ```typescript
  // Before:
  [current code]

  // After:
  [proposed code]
  ```
````

- **Considerations**: [Any risks, dependencies, or things to watch out for]

---

### 📁 [file2.ts]

[Similar structure for each file]

---

## Skipped Comments

1. **[file.ts:LINE]** - [Reason for skipping]
   > [Comment text]

---

## Next Steps

1. Review the fix plan above
2. For fixes you want to implement:
   - Implement manually, or
   - Ask: "Implement fix [number] from the plan"
3. Run linting: `npx nx lint [affected-projects]`
4. Test your changes
5. Commit with appropriate message
6. Push when ready

**Note**: No changes have been made to your code. This is a plan only.

```

## Notes

- **No automatic fixes** - generates plan only
- **No commits** - author decides when to commit
- **No code changes** - read-only analysis
- Only analyze clear, actionable comments
- Follow all project standards from `.cursor/rules/`
- Author maintains full control over implementation
```
