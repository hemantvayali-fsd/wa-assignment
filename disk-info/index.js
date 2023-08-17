import { platform as detectPlatform } from 'node:os';
import { processDarwinDisk } from './darwin.js';
import { processLinuxDisk } from './linux.js';
import { processWindowsDisk } from './windows.js';

const platform = detectPlatform().toLowerCase();

export const getDriveInfo = async () => {
  switch (platform) {
    case "darwin":
      return processDarwinDisk();
    case "linux":
      return processLinuxDisk();
    case "win32":
      return processWindowsDisk();
    default:
      throw new Error("Platform not supported");
  }
}