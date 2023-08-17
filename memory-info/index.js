import { platform as detectPlatform, totalmem, freemem } from 'node:os';
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

export const getRamData = () => {
  const totalRAM = Math.round(totalmem() / 1024 / 1024);
  const freeRAM = Math.round(freemem() / 1024 / 1024);
  const freeRAMPercent = Math.round((freeRAM / totalRAM) * 100);
  const usedRAM = totalRAM - freeRAM;
  return {
    totalSpace: totalRAM,
    usedSpace: usedRAM,
    freeSpace: freeRAM,
    freeSpacePercent: freeRAMPercent,
    usedSpacePercent: 100 - freeRAMPercent
  }
};