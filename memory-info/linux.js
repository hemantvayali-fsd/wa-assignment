import { exec } from "./utils.js";

const CMD_DISK = `df -Pl | tail -n +2`;

export const processLinuxDisk = async () => {
  const drives = [];
  let totalUsedSpace = 0;
  let totalDiskSpace = 0;

  const lines = (await exec(CMD_DISK)).split('\n');
  for (let line of lines) {
    if (line === '') continue;
    const tokens = line.replace(/ +(?= )/g, '').split(' ');
    const data = {
      fileSystem: tokens[0],
      totalSpace: isNaN(parseFloat(tokens[1])) ? 0 : convertToMB(+tokens[1]),
      usedSpace: isNaN(parseFloat(tokens[2])) ? 0 : convertToMB(+tokens[2]),
      freeSpace: isNaN(parseFloat(tokens[3])) ? 0 : convertToMB(+tokens[3]),
      usedSpacePercent: +(tokens[4].replace('%', '')),
      freeSpacePercent: 0,
      mounted: tokens[5]
    }
    data.freeSpacePercent = 100 - data.usedSpacePercent;
    totalUsedSpace += data.usedSpace;
    totalDiskSpace += data.totalSpace;
    drives.push(data);
  }
  return {
    totalSpace: totalDiskSpace,
    usedSpace: totalUsedSpace,
    freeSpace: totalDiskSpace - totalUsedSpace,
    drives
  }
}

function convertToMB(bytes) {
  if (!bytes) return 0;
  return Math.ceil(bytes / 1024);
}