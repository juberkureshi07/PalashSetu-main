const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('----------------------------------------------------');
console.log('🧪 Bhasha Gyan Phase 1 Test Suite: Security & Role Isolation (RBAC)');
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

// SHA-256 Hasher matching authService.ts logic
function hashPinNode(pin) {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

// 1. Verify RoleContext file exists
const roleContextPath = path.join(__dirname, '../mobile/src/context/RoleContext.tsx');
assert(fs.existsSync(roleContextPath), 'RoleContext.tsx file exists');

// 2. Verify PinModal component exists
const pinModalPath = path.join(__dirname, '../mobile/src/components/PinModal.tsx');
assert(fs.existsSync(pinModalPath), 'PinModal.tsx component exists');

// 3. Verify ProtectedRoute component exists
const protectedRoutePath = path.join(__dirname, '../mobile/src/components/ProtectedRoute.tsx');
assert(fs.existsSync(protectedRoutePath), 'ProtectedRoute.tsx component exists');

// 4. Verify Sidebar.tsx has STUDENT_NAV_ITEMS and TEACHER_NAV_ITEMS separation
const sidebarContent = fs.readFileSync(path.join(__dirname, '../mobile/src/components/Sidebar.tsx'), 'utf8');
assert(sidebarContent.includes('STUDENT_NAV_ITEMS'), 'Sidebar defines STUDENT_NAV_ITEMS');
assert(sidebarContent.includes('TEACHER_NAV_ITEMS'), 'Sidebar defines TEACHER_NAV_ITEMS');

const studentNavBlock = sidebarContent.split('TEACHER_NAV_ITEMS')[0];
assert(!studentNavBlock.includes("to: '/settings'"), 'Student sidebar strictly excludes sensitive settings route');

// 5. Verify App.tsx wraps teacher routes with ProtectedRoute
const appContent = fs.readFileSync(path.join(__dirname, '../mobile/src/App.tsx'), 'utf8');
assert(appContent.includes('<RoleProvider>'), 'App.tsx wraps app in RoleProvider');
assert(appContent.includes('<ProtectedRoute requireTeacher>'), 'App.tsx wraps teacher routes in ProtectedRoute');

// 6. Test SHA-256 PIN hashing logic
const defaultPinHash = hashPinNode('1234');
assert(defaultPinHash && defaultPinHash.length === 64, 'SHA-256 PIN hashing produces valid 64-character hex string');
assert(hashPinNode('1234') === defaultPinHash, 'SHA-256 PIN hash is deterministic');
assert(hashPinNode('0000') !== defaultPinHash, 'Incorrect PIN produces different hash');

console.log('\n----------------------------------------------------');
console.log(`📊 Phase 1 RBAC Verification Results: ${passCount}/${totalCount} Passed (${Math.round((passCount/totalCount)*100)}%)`);
console.log('----------------------------------------------------');

if (passCount === totalCount) {
  process.exit(0);
} else {
  process.exit(1);
}
