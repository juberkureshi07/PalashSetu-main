const { execSync } = require('child_process');
const path = require('path');

console.log('===============================================================');
console.log('🚀 BHASHA GYAN MASTER ARCHITECTURE VERIFICATION SUITE');
console.log('===============================================================\n');

const testScripts = [
  { name: 'Phase 1: Security & Role Isolation (RBAC)', script: 'scripts/test_phase1_rbac.js' },
  { name: 'Phase 2: On-Device SQL Database (dbService)', script: 'scripts/test_phase2_db.js' },
  { name: 'Phase 3: Agglutinative Morphological Engine', script: 'scripts/test_phase3_morphology.js' },
  { name: 'Phase 4: Multi-Tablet LAN Hotspot Streaming', script: 'scripts/test_phase4_lan.js' },
  { name: 'On-Device Linguistic & Latency Engine', script: 'scripts/test_offline_engine.js' },
];

let totalPassed = 0;
let totalFailed = 0;

for (const suite of testScripts) {
  console.log(`▶️ Running: ${suite.name}...`);
  try {
    const output = execSync(`node ${suite.script}`, { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
    console.log(output);
    totalPassed++;
  } catch (err) {
    console.error(`❌ Suite Failed: ${suite.name}`);
    console.error(err.stdout || err.message);
    totalFailed++;
  }
}

console.log('===============================================================');
console.log(`📊 MASTER VERIFICATION SUMMARY: ${totalPassed}/${testScripts.length} Test Suites Passed!`);
console.log('===============================================================');

if (totalFailed === 0) {
  process.exit(0);
} else {
  process.exit(1);
}
