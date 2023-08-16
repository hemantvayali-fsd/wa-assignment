import { platform as getPlatform } from 'node:os';

const platform = getPlatform().toLowerCase();

/*
  Calculates percentage from given numbers
  @param a - number | divident
  @param b - number | divisor
  @returns - number | (divident / divisor) * 100
*/
export const calculatePercentage = (a, b) => {
  if (b === 0) return 0;
  return Math.ceil((a / b) * 100);
}

/*
  Converts provided bytes into MB based on operating system
  @param bytes - size in bytes
  @retuns number - size in MBs
*/
export const formatBytesIntoMb = (bytes) => {
  if (bytes === 0) return 0;
  const divisor = platform === 'win32' | platform === 'linux' ? 1024 : 2048;
  // The mac command of 'node-disk-info' returns data in block size of 512 bytes
  // So, to convert it into MB we devide the number of blocks by 1024 * 2;
  return Math.ceil(bytes / divisor);
}