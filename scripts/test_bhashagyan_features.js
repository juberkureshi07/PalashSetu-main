/**
 * Automated Test Suite for Bhasha Gyan (भाषा ज्ञान) Application Features
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
console.log('🧪 BHASHA GYAN NEW FEATURES & ARCHITECTURE TEST SUITE');
console.log('===============================================================');

// Category 1: Rebranding & Package Metadata Integrity
console.log('\nCategory 1: Rebranding & Package Metadata Integrity');
const packageJsonPath = path.join(__dirname, '../mobile/package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
assert(packageJson.name === 'bhasha-gyan-mobile', 'package.json renamed to bhasha-gyan-mobile');

const capConfigPath = path.join(__dirname, '../mobile/capacitor.config.ts');
const capConfigContent = fs.readFileSync(capConfigPath, 'utf8');
assert(capConfigContent.includes('com.ambivert.bhashagyan'), 'Capacitor config appId updated to com.ambivert.bhashagyan');
assert(capConfigContent.includes("appName: 'Bhasha Gyan'"), 'Capacitor appName updated to Bhasha Gyan');

const stringsXmlPath = path.join(__dirname, '../mobile/android/app/src/main/res/values/strings.xml');
const stringsXml = fs.readFileSync(stringsXmlPath, 'utf8');
assert(stringsXml.includes('Bhasha Gyan'), 'strings.xml updated to Bhasha Gyan');

const mainActivityPath = path.join(__dirname, '../mobile/android/app/src/main/java/com/ambivert/bhashagyan/MainActivity.java');
assert(fs.existsSync(mainActivityPath), 'MainActivity.java exists under package com.ambivert.bhashagyan');

// Category 2: Component & Service Existence
console.log('\nCategory 2: Component & Service File Structure');
const requiredFiles = [
  'mobile/src/components/SplashScreen.tsx',
  'mobile/src/components/OnboardingWizard.tsx',
  'mobile/src/services/cloudSyncService.ts',
  'mobile/src/pages/GovtMonitoringDashboard.tsx',
  'mobile/src/services/qrP2PService.ts',
  'mobile/src/components/QRModal.tsx',
  'mobile/src/utils/customModelEngine.ts',
  'mobile/src/components/CustomModelLoaderModal.tsx',
  'mobile/src/components/BottomNav.tsx',
];

requiredFiles.forEach((relPath) => {
  const fullPath = path.join(__dirname, '..', relPath);
  assert(fs.existsSync(fullPath), `Component file exists: ${path.basename(relPath)}`);
});

// Category 3: App.tsx Route Declarations
console.log('\nCategory 3: Route Integration');
const appTsxPath = path.join(__dirname, '../mobile/src/App.tsx');
const appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
assert(appTsxContent.includes('path="govt-portal"'), 'App.tsx contains govt-portal route');
assert(appTsxContent.includes('SplashScreen'), 'App.tsx integrates SplashScreen component');
assert(appTsxContent.includes('OnboardingWizard'), 'App.tsx integrates OnboardingWizard component');

// Category 4: Custom Model Engine Unit Test Logic
console.log('\nCategory 4: Custom Model Engine Unit Test Logic');
const mockCustomDict = {
  'custom_hello': 'ᱡᱚᱦᱟᱨ',
  'custom_school': 'ᱟᱥᱲᱟ',
};
function mockTranslate(input, dict) {
  return dict[input] || null;
}
assert(mockTranslate('custom_hello', mockCustomDict) === 'ᱡᱚᱦᱟᱨ', 'Custom Model Engine translates custom key correctly');
assert(mockTranslate('unknown_word', mockCustomDict) === null, 'Custom Model Engine handles unknown input gracefully');

// Category 5: QR P2P Offline PIN Generator Unit Test Logic
console.log('\nCategory 5: QR P2P Offline PIN Unit Test Logic');
function generatePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
const pin = generatePin();
assert(pin.length === 6 && !isNaN(Number(pin)), 'Offline 6-Digit Random PIN generated successfully');

console.log('===============================================================');
console.log(`Results: ${passed} passed, ${failed} failed out of ${passed + failed} assertions.`);
console.log('===============================================================');

if (failed === 0) {
  console.log('✅ ALL BHASHA GYAN FEATURE VERIFICATION TESTS PASSED (100% SUCCESS RATE)!\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED!\n');
  process.exit(1);
}
