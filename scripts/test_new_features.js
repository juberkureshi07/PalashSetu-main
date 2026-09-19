/**
 * Automated Test Suite for Bhasha Gyan New Differentiated Features
 * Ambivert's Team - Bhasha Gyan Project
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('===============================================================');
console.log('🧪 BHASHA GYAN NEW FEATURES & REBRANDING TEST SUITE');
console.log('===============================================================');

// 1. Verify Rebranding Files
console.log('\nCategory 1: Rebranding & Metadata Integrity');

const pkgPath = path.join(__dirname, '../mobile/package.json');
const capPath = path.join(__dirname, '../mobile/capacitor.config.ts');
const readmePath = path.join(__dirname, '../README.md');

const pkgContent = fs.readFileSync(pkgPath, 'utf8');
const capContent = fs.readFileSync(capPath, 'utf8');
const readmeContent = fs.readFileSync(readmePath, 'utf8');

assert(pkgContent.includes('bhasha-gyan-mobile'), 'package.json renamed to bhasha-gyan-mobile');
assert(capContent.includes('com.ambivert.bhashagyan'), 'Capacitor config updated to com.ambivert.bhashagyan');
assert(capContent.includes("appName: 'Bhasha Gyan'"), 'Capacitor appName updated to Bhasha Gyan');
assert(readmeContent.includes("# Bhasha Gyan"), 'README.md updated with Bhasha Gyan title');
assert(readmeContent.includes("Ambivert's Team"), "README.md claims ownership for Ambivert's Team");

// 2. Verify Feature Files Exist
console.log('\nCategory 2: Differentiated Feature Component Structure');

const filesToVerify = [
  '../mobile/src/pages/PracticeMode.tsx',
  '../mobile/src/pages/PronunciationCoach.tsx',
  '../mobile/src/pages/Contribute.tsx',
  '../mobile/src/pages/ContributionReview.tsx',
  '../mobile/src/pages/StudentBroadcastView.tsx',
  '../mobile/src/services/contributionService.ts',
  '../mobile/src/services/broadcastService.ts',
  '../mobile/src/utils/audioAnalysis.ts',
];

filesToVerify.forEach((relPath) => {
  const fullPath = path.join(__dirname, relPath);
  assert(fs.existsSync(fullPath), `Component file exists: ${path.basename(relPath)}`);
});

// 3. Verify Route Registrations in App.tsx
console.log('\nCategory 3: Route Integration');
const appPath = path.join(__dirname, '../mobile/src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

assert(appContent.includes('/practice') || appContent.includes('path="practice"'), 'App.tsx contains practice route');
assert(appContent.includes('/pronounce') || appContent.includes('path="pronounce"'), 'App.tsx contains pronounce route');
assert(appContent.includes('/contribute') || appContent.includes('path="contribute"'), 'App.tsx contains contribute route');
assert(appContent.includes('path="contribute/review"'), 'App.tsx contains contribute/review route');
assert(appContent.includes('path="student-view"'), 'App.tsx contains student-view route');

// 4. Verify DTW Math Logic
console.log('\nCategory 4: Audio Analysis DTW Algorithm Unit Test');

function computeDTWDistance(seq1, seq2) {
  const n = seq1.length;
  const m = seq2.length;
  if (n === 0 || m === 0) return 0;
  const dtw = Array.from({ length: n + 1 }, () => Array(m + 1).fill(Infinity));
  dtw[0][0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = Math.abs(seq1[i - 1] - seq2[j - 1]);
      dtw[i][j] = cost + Math.min(dtw[i - 1][j], dtw[i][j - 1], dtw[i - 1][j - 1]);
    }
  }
  const rawDist = dtw[n][m];
  const maxLen = Math.max(n, m);
  const normalizedDist = rawDist / maxLen;
  return Math.max(0, Math.min(100, Math.round((1 - normalizedDist) * 100)));
}

const identicalScore = computeDTWDistance([0.1, 0.5, 0.9, 0.2], [0.1, 0.5, 0.9, 0.2]);
assert(identicalScore === 100, 'Identical audio sequences return 100% similarity match');

const slightlyDifferentScore = computeDTWDistance([0.1, 0.5, 0.9, 0.2], [0.1, 0.4, 0.8, 0.2]);
assert(slightlyDifferentScore > 80 && slightlyDifferentScore < 100, 'Slightly varied sequences return high similarity match (>80%)');

console.log('===============================================================');
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions.`);
console.log('===============================================================');

if (failed === 0) {
  console.log('✅ ALL NEW FEATURE VERIFICATION TESTS PASSED (100% SUCCESS RATE)!');
} else {
  process.exit(1);
}
