#!/bin/bash

# Quick Download and Run Script for ngx-lift AsyncState Migration
# Usage: curl -sSL https://raw.githubusercontent.com/wghglory/ngx-lift-workspace/main/migration/download-and-migrate.sh | bash -s -- src

set -e

echo "🔄 ngx-lift AsyncState Migration"
echo "================================"
echo ""

# Check if directory argument is provided
TARGET_DIR="${1:-src}"

# Download the migration script
echo "📥 Downloading migration script..."
curl -sSL -o migrate-async-state.js https://raw.githubusercontent.com/wghglory/ngx-lift-workspace/main/migration/migrate-async-state.js

if [ $? -ne 0 ]; then
    echo "❌ Failed to download migration script"
    exit 1
fi

echo "✅ Migration script downloaded"
echo ""

# Make script executable
chmod +x migrate-async-state.js

# Ask user if they want to run a dry-run first
echo "❓ Would you like to run a dry-run first to preview changes? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "🔍 Running dry-run on '$TARGET_DIR'..."
    node migrate-async-state.js "$TARGET_DIR" --dry-run
    echo ""
    echo "❓ Proceed with actual migration? (y/n)"
    read -r proceed
    
    if [[ ! "$proceed" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "❌ Migration cancelled"
        rm migrate-async-state.js
        exit 0
    fi
fi

# Run the actual migration
echo ""
echo "🚀 Running migration on '$TARGET_DIR'..."
node migrate-async-state.js "$TARGET_DIR"

echo ""
echo "================================"
echo "✅ Migration complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review changes: git diff"
echo "   2. Run tests: npm test"
echo "   3. Commit: git commit -am 'chore: migrate to ngx-lift v19 AsyncState'"
echo ""
echo "🗑️  You can delete the migration script:"
echo "   rm migrate-async-state.js"
