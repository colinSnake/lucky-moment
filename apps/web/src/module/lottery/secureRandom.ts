export type RandomValuesSource = (values: Uint32Array) => void;

const UINT32_RANGE = 0x1_0000_0000;

export function secureRandomIndex(
  maxExclusive: number,
  fillRandomValues: RandomValuesSource = (values) => {
    globalThis.crypto.getRandomValues(values);
  },
): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > UINT32_RANGE) {
    throw new RangeError("maxExclusive must be an integer between 1 and 2^32");
  }
  if (maxExclusive === 1) return 0;

  const acceptanceLimit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
  const values = new Uint32Array(1);

  do {
    fillRandomValues(values);
  } while (values[0] >= acceptanceLimit);

  return values[0] % maxExclusive;
}
