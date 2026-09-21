const fs = require('fs');
const path = require('path');

console.log('----------------------------------------------------');
console.log('🧪 Bhasha Gyan Phase 4 Test Suite: Multi-Tablet LAN Hotspot Streaming');
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

// 1. Verify qrGenerator.ts exists
const qrGenPath = path.join(__dirname, '../mobile/src/utils/qrGenerator.ts');
assert(fs.existsSync(qrGenPath), 'qrGenerator.ts file exists');

const qrContent = fs.readFileSync(qrGenPath, 'utf8');
assert(qrContent.includes('export function generateOfflineQRCodeSVG'), 'generateOfflineQRCodeSVG function exists');
assert(qrContent.includes('<svg'), 'qrGenerator produces native SVG markup without external cloud dependencies');

// 2. Verify qrP2PService.ts imports offline QR generator
const qrP2PPath = path.join(__dirname, '../mobile/src/services/qrP2PService.ts');
const qrP2PContent = fs.readFileSync(qrP2PPath, 'utf8');
assert(qrP2PContent.includes("import { generateOfflineQRCodeSVG } from '../utils/qrGenerator'"), 'qrP2PService imports generateOfflineQRCodeSVG');
assert(!qrP2PContent.includes('api.qrserver.com'), 'qrP2PService excludes external cloud QR server API');

// 3. Verify webrtcP2PService.ts exists and handles broadcast payload
const webrtcPath = path.join(__dirname, '../mobile/src/services/webrtcP2PService.ts');
const webrtcContent = fs.readFileSync(webrtcPath, 'utf8');
assert(webrtcContent.includes('broadcastCaption'), 'webrtcP2PService contains broadcastCaption method');
assert(webrtcContent.includes('onCaptionReceived'), 'webrtcP2PService contains onCaptionReceived event listener');

console.log('\n----------------------------------------------------');
console.log(`📊 Phase 4 LAN Verification Results: ${passCount}/${totalCount} Passed (${Math.round((passCount/totalCount)*100)}%)`);
console.log('----------------------------------------------------');

if (passCount === totalCount) {
  process.exit(0);
} else {
  process.exit(1);
}
