import { execSync } from 'node:child_process';
import os from 'node:os';

const platform = os.platform().toLowerCase();

export const execute = (command) => {
  return execSync(command, { windowsHide: true, encoding: 'buffer' });
}

export const convertToPercentage = (a, b) => {
  if (b === 0) return 0;
  return Math.ceil((a / b) * 100);
}

export const formatBytesIntoMb = (bytes) => {
  if (bytes === 0) return 0;
  const divisor = platform === 'win32' | platform === 'linux' ? 1024 : 2048;
  // The mac command of 'node-disk-info' returns data in block size of 512 bytes
  // So, to convert it into MB we devide the number of blocks by 1024 * 2;
  return Math.ceil(bytes / divisor);
}