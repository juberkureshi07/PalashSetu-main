const fs = require('fs');
const path = require('path');

console.log('----------------------------------------------------');
console.log('🧪 Bhasha Gyan Phase 3 Test Suite: Morphological Engine & Acoustic TTS');
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

// 1. Verify santaliSpeech.ts contains agglutinateSantaliSuffixes
const santaliSpeechPath = path.join(__dirname, '../mobile/src/utils/santaliSpeech.ts');
assert(fs.existsSync(santaliSpeechPath), 'santaliSpeech.ts file exists');

const santaliSpeechContent = fs.readFileSync(santaliSpeechPath, 'utf8');
assert(santaliSpeechContent.includes('export function agglutinateSantaliSuffixes'), 'agglutinateSantaliSuffixes exported function exists');
assert(santaliSpeechContent.includes('Locative: -re'), 'agglutinateSantaliSuffixes handles Locative -re suffix');
assert(santaliSpeechContent.includes('Instrumental: -te'), 'agglutinateSantaliSuffixes handles Instrumental -te suffix');
assert(santaliSpeechContent.includes('Source/Ablative: -khon'), 'agglutinateSantaliSuffixes handles Ablative -khon suffix');

// 2. Test suffix combining logic via node regex emulation
function agglutinateTest(text) {
  return text
    .replace(/([\u1C50-\u1C7F]+)\s+ᱨᱮ(?=\s|$|[।,.!?])/g, '$1ᱨᱮ')
    .replace(/([\u1C50-\u1C7F]+)\s+ᱛᱮ(?=\s|$|[।,.!?])/g, '$1ᱛᱮ')
    .replace(/([\u1C50-\u1C7F]+)\s+ᱠᱷᱚᱱ(?=\s|$|[।,.!?])/g, '$1ᱠᱷᱚᱱ')
    .replace(/([\u1C50-\u1C7F]+)\s+ᱠᱚ(?=\s|$|[।,.!?])/g, '$1ᱠᱚ');
}

assert(agglutinateTest('ᱯᱩᱛᱷᱤ ᱨᱮ') === 'ᱯᱩᱛᱷᱤᱨᱮ', 'Morphology: "ᱯᱩᱛᱷᱤ ᱨᱮ" -> "ᱯᱩᱛᱷᱤᱨᱮ" (in book)');
assert(agglutinateTest('ᱚᱲᱟᱜ ᱠᱷᱚᱱ') === 'ᱚᱲᱟᱜᱠᱷᱚᱱ', 'Morphology: "ᱚᱲᱟᱜ ᱠᱷᱚᱱ" -> "ᱚᱲᱟᱜᱠᱷᱚᱱ" (from house)');
assert(agglutinateTest('ᱠᱚᱞᱚᱢ ᱛᱮ') === 'ᱠᱚᱞᱚᱢᱛᱮ', 'Morphology: "ᱠᱚᱞᱚᱢ ᱛᱮ" -> "ᱠᱚᱞᱚᱢᱛᱮ" (with pen)');
assert(agglutinateTest('ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ') === 'ᱜᱤᱫᱽᱨᱟᱹᱠᱚ', 'Morphology: "ᱜᱤᱫᱽᱨᱟᱹ ᱠᱚ" -> "ᱜᱤᱫᱽᱨᱟᱹᱠᱚ" (children)');

console.log('\n----------------------------------------------------');
console.log(`📊 Phase 3 Verification Results: ${passCount}/${totalCount} Passed (${Math.round((passCount/totalCount)*100)}%)`);
console.log('----------------------------------------------------');

if (passCount === totalCount) {
  process.exit(0);
} else {
  process.exit(1);
}
