/**
 * On-Device Audio Signal Analysis Utility
 * Computes spectral energy rhythm envelopes and Dynamic Time Warping (DTW) similarity scores
 * for teacher pronunciation coaching.
 */

// Simple Dynamic Time Warping (DTW) algorithm between two 1D numerical sequences
export function computeDTWDistance(seq1: number[], seq2: number[]): number {
  const n = seq1.length;
  const m = seq2.length;
  if (n === 0 || m === 0) return 0;

  // Initialize cost matrix
  const dtw: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(Infinity)
  );
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

  // Convert distance into a similarity percentage (0% to 100%)
  const similarity = Math.max(0, Math.min(100, Math.round((1 - normalizedDist) * 100)));
  return similarity;
}

// Generate synthesized reference audio feature sequence (rhythm/energy envelope) from a string
export function generateReferenceFeatureEnvelope(text: string, numBins: number = 30): number[] {
  const envelope: number[] = [];
  const charSum = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  for (let i = 0; i < numBins; i++) {
    // Generate deterministic natural acoustic wave envelope shape
    const baseWave = Math.sin((i / numBins) * Math.PI);
    const harmonic = 0.3 * Math.sin((i / numBins) * Math.PI * 3 + charSum);
    const energy = Math.max(0.05, Math.min(1.0, baseWave + harmonic));
    envelope.push(parseFloat(energy.toFixed(3)));
  }

  return envelope;
}

// Extract audio energy envelope from recorded AudioBuffer using Web Audio API
export function extractAudioEnvelope(audioBuffer: AudioBuffer, numBins: number = 30): number[] {
  const rawData = audioBuffer.getChannelData(0);
  const binSize = Math.floor(rawData.length / numBins);
  const envelope: number[] = [];

  for (let i = 0; i < numBins; i++) {
    let sum = 0;
    const start = i * binSize;
    const end = Math.min(start + binSize, rawData.length);
    for (let j = start; j < end; j++) {
      sum += Math.abs(rawData[j]);
    }
    const avg = end > start ? sum / (end - start) : 0;
    envelope.push(parseFloat(avg.toFixed(3)));
  }

  // Normalize envelope between 0 and 1
  const maxVal = Math.max(...envelope, 0.001);
  return envelope.map((v) => parseFloat((v / maxVal).toFixed(3)));
}
