#!/usr/bin/env bash
# Shared step-summary status mapping for the deploy and publish workflows.
# Source from a workflow step after checkout:
#   source .github/scripts/status-summary.sh

get_status_icon() {
  case "$1" in
    "success") echo "✅" ;;
    "failure") echo "❌" ;;
    "cancelled") echo "🚫" ;;
    "skipped") echo "⏭️" ;;
    *) echo "⏳" ;;
  esac
}

get_status_badge() {
  case "$1" in
    "success") echo "![Success](https://img.shields.io/badge/status-success-brightgreen)" ;;
    "failure") echo "![Failure](https://img.shields.io/badge/status-failure-red)" ;;
    "cancelled") echo "![Cancelled](https://img.shields.io/badge/status-cancelled-yellow)" ;;
    "skipped") echo "![Skipped](https://img.shields.io/badge/status-skipped-lightgrey)" ;;
    *) echo "![Pending](https://img.shields.io/badge/status-pending-orange)" ;;
  esac
}
