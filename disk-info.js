import diskInfo from 'node-disk-info';
import { convertToPercentage, formatBytesIntoMb } from './utils.js';

const parseDiskData = (dataList) => {
  const hdd = {
    totalSpace: 0,
    usedSpace: { inMb: 0, inPerc: 0 },
    freeSpace: { inMb: 0, inPerc: 0 },
    drives: []
  };
  hdd.totalSpace = formatBytesIntoMb(dataList[0].blocks);
  for (let drive of dataList) {
    const totalSpace = formatBytesIntoMb(drive.blocks);
    const usedSpace = formatBytesIntoMb(drive.used);
    const usedSpacePerc = convertToPercentage(usedSpace, totalSpace);
    hdd.usedSpace.inMb += usedSpace;
    const obj = {
      mountPoint: drive.mounted,
      totalSpace,
      usedSpace: { inMb: usedSpace, inPerc: usedSpacePerc },
      freeSpace: { inMb: totalSpace - usedSpace, inPerc: 100 - usedSpacePerc }
    }
    hdd.drives.push(obj);
  }
  hdd.usedSpace.inPerc = convertToPercentage(hdd.usedSpace.inMb, hdd.totalSpace);
  hdd.freeSpace.inMb = hdd.totalSpace - hdd.usedSpace.inMb;
  hdd.freeSpace.inPerc = 100 - hdd.usedSpace.inPerc;
  return hdd;
}

export const getDiskInfo = async () => {
  try {
    const drives = await diskInfo.getDiskInfo();
    return parseDiskData(drives);
  } catch (error) {
    throw error;
  }
};