const fs = require('fs');
const path = require('path');

console.log('----------------------------------------------------');
console.log('🧪 Bhasha Gyan Phase 2 Test Suite: On-Device Database (dbService.ts)');
console.log('----------------------------------------------------\n');

let passCount = 0;
let totalCount = 0;

function assert(condition, message) {
  totalCount++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

// 1. Verify dbService.ts file exists
const dbServicePath = path.join(__dirname, '../mobile/src/services/dbService.ts');
assert(fs.existsSync(dbServicePath), 'dbService.ts file exists in mobile/src/services/');

// 2. Read dbService.ts content and verify store definitions
const dbContent = fs.readFileSync(dbServicePath, 'utf8');
assert(dbContent.includes('teacher_profiles'), 'dbService defines teacher_profiles object store');
assert(dbContent.includes('student_progress'), 'dbService defines student_progress object store');
assert(dbContent.includes('contributions'), 'dbService defines contributions object store');
assert(dbContent.includes('custom_words'), 'dbService defines custom_words object store');

// 3. Verify export / backup JSON functionality
assert(dbContent.includes('exportDatabaseJSON'), 'dbService includes exportDatabaseJSON function');

// 4. Verify authService integration with dbService
const authContent = fs.readFileSync(path.join(__dirname, '../mobile/src/services/authService.ts'), 'utf8');
assert(authContent.includes("import { dbService } from './dbService'"), 'authService imports dbService');
assert(authContent.includes('dbService.saveTeacherProfile'), 'authService syncs profiles to dbService');

console.log('\n----------------------------------------------------');
console.log(`📊 Phase 2 DB Verification Results: ${passCount}/${totalCount} Passed (${Math.round((passCount/totalCount)*100)}%)`);
console.log('----------------------------------------------------');

if (passCount === totalCount) {
  process.exit(0);
} else {
  process.exit(1);
}
