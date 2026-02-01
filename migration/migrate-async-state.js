#!/usr/bin/env node

/**
 * Migration Script for ngx-lift AsyncState Breaking Change
 *
 * This script helps migrate code from the old AsyncState interface to the new one:
 * - `loading` property renamed to `isLoading`
 * - Added `status` property with ResourceStatus type
 *
 * Usage:
 *   node migration/migrate-async-state.js [directory]
 *   node migration/migrate-async-state.js src/app
 *   node migration/migrate-async-state.js .  # Current directory
 *
 * Options:
 *   --dry-run    Show what would be changed without modifying files
 *   --help       Show this help message
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');
const SHOW_HELP = process.argv.includes('--help');

if (SHOW_HELP) {
  console.log(`
Migration Script for ngx-lift AsyncState Breaking Change
=========================================================

This script migrates code from the old AsyncState interface to the new one.

Changes:
  - Renames 'loading' property to 'isLoading' in AsyncState objects
  - Renames 'loading' in AsyncState type definitions
  - Updates template references from 'state.loading' to 'state.isLoading'

Usage:
  node migration/migrate-async-state.js [directory]
  node migration/migrate-async-state.js src/app
  node migration/migrate-async-state.js .  # Current directory

Options:
  --dry-run    Show what would be changed without modifying files
  --help       Show this help message

Examples:
  # Migrate entire src directory
  node migration/migrate-async-state.js src

  # Dry run to preview changes
  node migration/migrate-async-state.js src --dry-run

  # Migrate from current directory
  node migration/migrate-async-state.js .
`);
  process.exit(0);
}

const targetDir = process.argv[2] || '.';

console.log('🔄 AsyncState Migration Script');
console.log('================================\n');
if (DRY_RUN) {
  console.log('⚠️  DRY RUN MODE - No files will be modified\n');
}

let filesScanned = 0;
let filesModified = 0;
let totalReplacements = 0;

/**
 * Patterns to match and replace
 */
const patterns = [
  // Pattern 1: Direct property access in TypeScript (state.loading -> state.isLoading)
  {
    regex: /\b(\w+)\.loading\b/g,
    replacement: '$1.isLoading',
    description: 'Property access (state.loading → state.isLoading)',
  },
  // Pattern 2: AsyncState type with loading property
  {
    regex: /loading:\s*boolean/g,
    replacement: 'isLoading: boolean',
    description: 'Type definition (loading: boolean → isLoading: boolean)',
  },
  // Pattern 3: Object literal with loading property (common in tests and initial values)
  {
    regex: /loading:\s*(?:true|false)/g,
    replacement: (match) => match.replace('loading:', 'isLoading:'),
    description: 'Object literal (loading: true → isLoading: true)',
  },
  // Pattern 4: Destructuring {loading, ...} -> {isLoading, ...}
  {
    regex: /\{\s*loading\s*,/g,
    replacement: '{ isLoading,',
    description: 'Destructuring ({ loading, ... } → { isLoading, ... })',
  },
  {
    regex: /,\s*loading\s*\}/g,
    replacement: ', isLoading }',
    description: 'Destructuring ({ ..., loading } → { ..., isLoading })',
  },
  {
    regex: /,\s*loading\s*,/g,
    replacement: ', isLoading,',
    description: 'Destructuring ({ ..., loading, ... } → { ..., isLoading, ... })',
  },
  // Pattern 5: Template bindings [disabled]="state.loading" or *ngIf="state.loading"
  {
    regex: /(\[[\w-]+\]|\*ng\w+)="([^"]*?)\.loading"/g,
    replacement: '$1="$2.isLoading"',
    description: 'Template binding ([disabled]="state.loading" → [disabled]="state.isLoading")',
  },
  // Pattern 6: Template interpolation {{ state.loading }}
  {
    regex: /\{\{\s*(\w+)\.loading\s*\}\}/g,
    replacement: '{{ $1.isLoading }}',
    description: 'Template interpolation ({{ state.loading }} → {{ state.isLoading }})',
  },
];

/**
 * Check if file should be processed
 */
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return ['.ts', '.html', '.component.html'].includes(ext);
}

/**
 * Process a single file
 */
function processFile(filePath) {
  filesScanned++;

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modifiedContent = content;
    let fileChanged = false;
    const changes = [];

    patterns.forEach((pattern) => {
      const matches = content.match(pattern.regex);
      if (matches) {
        const count = matches.length;
        modifiedContent = modifiedContent.replace(pattern.regex, pattern.replacement);
        fileChanged = true;
        totalReplacements += count;
        changes.push({description: pattern.description, count});
      }
    });

    if (fileChanged) {
      filesModified++;
      console.log(`\n✏️  ${path.relative(process.cwd(), filePath)}`);
      changes.forEach(({description, count}) => {
        console.log(`   - ${description} (${count} occurrence${count > 1 ? 's' : ''})`);
      });

      if (!DRY_RUN) {
        fs.writeFileSync(filePath, modifiedContent, 'utf8');
        console.log('   ✅ File updated');
      }
    }
  } catch (error) {
    console.error(`\n❌ Error processing ${filePath}:`, error.message);
  }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    // Skip node_modules, dist, .git, etc.
    if (
      item === 'node_modules' ||
      item === 'dist' ||
      item === '.git' ||
      item === '.nx' ||
      item === 'coverage' ||
      item === '.angular'
    ) {
      return;
    }

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (stat.isFile() && shouldProcessFile(fullPath)) {
      processFile(fullPath);
    }
  });
}

/**
 * Main execution
 */
try {
  const targetPath = path.resolve(targetDir);

  if (!fs.existsSync(targetPath)) {
    console.error(`❌ Error: Directory '${targetDir}' does not exist`);
    process.exit(1);
  }

  console.log(`📂 Scanning: ${targetPath}\n`);
  console.log('Looking for AsyncState usage with old "loading" property...\n');

  scanDirectory(targetPath);

  console.log('\n================================');
  console.log('📊 Migration Summary');
  console.log('================================');
  console.log(`Files scanned: ${filesScanned}`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total replacements: ${totalReplacements}`);

  if (DRY_RUN && filesModified > 0) {
    console.log('\n⚠️  This was a dry run. Run without --dry-run to apply changes.');
  } else if (filesModified === 0) {
    console.log('\n✅ No changes needed - your code is already up to date!');
  } else {
    console.log('\n✅ Migration complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review the changes');
    console.log('   2. Run your linter: npm run lint');
    console.log('   3. Run your tests: npm test');
    console.log('   4. Commit the changes');
  }
} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  process.exit(1);
}
