#!/usr/bin/env bash
# Read-only evidence collection for docs/codebase gap sweeps.
# Usage: scripts/collect-evidence.sh [--output /tmp/gap-evidence.md]

set -uo pipefail

output=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --output)
      output="${2:-}"
      shift 2
      ;;
    *)
      printf 'Unknown option: %s\n' "$1" >&2
      exit 2
      ;;
  esac
done

if ! git rev-parse --show-toplevel >/dev/null 2>&1; then
  printf 'Run this script from a git workspace.\n' >&2
  exit 1
fi

cd "$(git rev-parse --show-toplevel)" || exit 1
if [ -n "$output" ]; then
  : > "$output"
fi

emit() {
  if [ -n "$output" ]; then
    printf '%s\n' "$*" >> "$output"
  else
    printf '%s\n' "$*"
  fi
}

section() {
  emit
  emit "## $1"
  emit
}

run() {
  local title="$1"
  shift
  emit "### $title"
  emit '```text'
  ("$@" 2>&1 || true) | while IFS= read -r line; do emit "$line"; done
  emit '```'
  emit
}

emit "# Gap evidence"
emit
emit "Generated: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
emit "Workspace: $(git rev-parse --show-toplevel)"

section "Repository state"
run "Branch and worktree" git status --short --branch
run "HEAD" git rev-parse HEAD
run "Recent commits" git --no-pager log -12 --oneline --decorate
run "Tags at HEAD" git tag --points-at HEAD
run "Remote release tags" bash -c "git ls-remote --tags origin 'refs/tags/ngx-lift@*' 'refs/tags/clr-lift@*' | tail -20 || true"

section "Package versions"
run "Source manifests" node -e 'const fs=require("fs"); for (const p of ["package.json","libs/ngx-lift/package.json","libs/clr-lift/package.json"]) { const j=JSON.parse(fs.readFileSync(p,"utf8")); console.log(p, j.name||"(private)", j.version); } console.log("packageManager", JSON.parse(fs.readFileSync("package.json","utf8")).packageManager);'
run "Official npm versions" bash -c "pnpm view --registry=https://registry.npmjs.org ngx-lift version || true; pnpm view --registry=https://registry.npmjs.org clr-lift version || true"
run "Validation scripts" node -e 'const s=require("./package.json").scripts; for (const k of ["validate","release:check","format:check","i18n:check","lint","typecheck","test:tools","e2e:verify"]) console.log(k+": "+(s[k]||"(missing)"));'

section "Tracker and workflow runs"
if command -v gh >/dev/null 2>&1; then
  run "Open issues" gh issue list --state open --json number,title,labels --jq '.[] | "#\(.number) [\([.labels[].name] | join(","))] \(.title)"'
  run "Open PRs" gh pr list --state open --json number,title,headRefName,updatedAt --jq '.[] | "#\(.number) \(.headRefName) \(.updatedAt) \(.title)"'
  run "Recent releases" gh release list --limit 8
  run "Deployment secret names" gh secret list --json name --jq '.[].name'
  run "CI runs" gh run list --workflow=ci.yml --limit 10 --json createdAt,event,headBranch,conclusion --jq '.[] | "\(.createdAt) \(.event) \(.headBranch) \(.conclusion // "pending")"'
  run "Deploy runs" gh run list --workflow=deploy-demo.yml --limit 10 --json databaseId,createdAt,headBranch,conclusion --jq '.[] | "\(.createdAt) \(.headBranch) \(.conclusion // "pending") #\(.databaseId)"'
  run "Publish runs" gh run list --workflow=publish.yml --limit 10 --json databaseId,createdAt,headBranch,conclusion --jq '.[] | "\(.createdAt) \(.headBranch) \(.conclusion // "pending") #\(.databaseId)"'
else
  emit "The gh CLI is unavailable; fetch tracker, release, and workflow-run evidence manually."
fi

section "Documentation inventory"
run "Markdown files" bash -c "find docs .agents/skills -name '*.md' -type f | sort; find . -maxdepth 1 -name '*.md' -type f | sort"
run "Status claims" bash -c "grep -RInE --include='*.md' 'Status:|Updated |not published|pending|Draft|deferred|waived|YAML|assistive-technology|native-language' docs README.md CHANGELOG.md CONTRIBUTING.md libs/ngx-lift/README.md libs/clr-lift/README.md | head -240 || true"

section "Workflow and code facts"
run "Workflow guards and gates" bash -c "grep -RInE 'if:|continue-on-error|timeout-minutes|secrets:|uses:|concurrency:' .github/workflows | head -240 || true"
run "Nx Cloud and cache inputs" bash -c "grep -RInE 'nxCloudId|neverConnectToCloud|NX_CLOUD_ACCESS_TOKEN|sharedGlobals|actions/cache' nx.json .github/workflows | head -160 || true"
run "Coverage thresholds" bash -c "grep -RInE 'thresholds|statements|branches|functions|lines' apps/demo/vite.config.mts libs/*/vite.config.mts tools/vitest/show-coverage-summary.mjs | head -120 || true"
run "Supported locales" bash -c "grep -RInE 'en|zh-CN|pt-BR|ru' apps/demo/src/app/core/components/language-switcher/language-switcher.component.ts tools/i18n/check-translations.mjs | head -120 || true"
run "Public barrels" bash -c "find libs -path '*/src/index.ts' -o -path '*/src/lib/*/index.ts' | sort | head -120"
run "Design specs" bash -c "find docs/design -name '*.md' -type f | sort"
run "Gap register" bash -c "test -f docs/gap-register.md && sed -n '1,80p' docs/gap-register.md || true"

emit
emit "Evidence collection complete. Use semantic comparison before assigning gap dispositions."
