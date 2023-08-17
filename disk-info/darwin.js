import { exec } from "../utils.js";

export class Darwin {
  static CMD_DISK = `df -Pl | tail -n +2`;

  static run = async () => {
    const re = new RegExp(/^(\/dev\/disk\d{1})/);
    const drives = [];
    const disks = {};
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
      const diskName = data.fileSystem.match(re)[0];
      if (!disks[diskName]) {
        totalDiskSpace += data.totalSpace;
        disks[diskName] = true;
      }
      drives.push(data);
    }
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