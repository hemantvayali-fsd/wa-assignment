import { exec } from "./utils.js";

export class Darwin {
  static CMD_DISK = `df -Pl | tail -n +2`;

  static run = async () => {
    const drives = [];
    let totalUsedSpace = 0;
    let totalDiskSpace = 0;

    const lines = (await exec(this.CMD_DISK)).split('\n');
    for (let line of lines) {
      if (line === '') continue;
      const tokens = line.replace(/ +(?= )/g, '').split(' ');
      const data = {
        fileSystem: tokens[0],
        totalSpace: isNaN(parseFloat(tokens[1])) ? 0 : this.convertToMB(+tokens[1]),
        usedSpace: isNaN(parseFloat(tokens[2])) ? 0 : this.convertToMB(+tokens[2]),
        freeSpace: isNaN(parseFloat(tokens[3])) ? 0 : this.convertToMB(+tokens[3]),
        usedSpacePercentage: +(tokens[4].replace('%', '')),
        freeSpacePercentage: 0,
        mounted: tokens[5]
      }
      data.freeSpacePercentage = 100 - data.usedSpacePercentage;
      totalUsedSpace += data.usedSpace;
      totalDiskSpace += data.totalSpace;
      drives.push(data);
    }
    console.log(disks, totalDiskSpace, totalUsedSpace)
    return {
      totalSpace: totalDiskSpace,
      usedSpace: totalUsedSpace,
      freeSpace: totalDiskSpace - totalUsedSpace,
      drives
    }

  }

  static convertToMB = (bytes) => {
    if (!bytes) return 0;
    return Math.ceil(bytes / 1024 / 2);
  }
}

Darwin.run();