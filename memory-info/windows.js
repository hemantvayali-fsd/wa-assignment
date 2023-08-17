import iconv from 'iconv-lite';
import { exec } from './utils.js';

const WINDOWS_COMMAND = 'wmic logicaldisk get Caption,FreeSpace,Size,VolumeSerialNumber,Description  /format:list';

export const processWindowsDisk = async () => {
  const drives = [];
  const encoding = getEncoding();
  let buffer = await exec(Constants.WINDOWS_COMMAND);
  buffer = iconv.encode(iconv.decode(buffer, encoding), 'UTF-8');

  const lines = buffer.toString().split('\r\r\n');
  let newDiskIteration = false;
  let mounted = '';
  let fileSystem = '';
  let freeSpace = 0;
  let totalSpace = 0;
  let totalDiskSpace = 0;
  let totalUsedSpace = 0;

  lines.forEach((value) => {
    if (value !== '') {

      const tokens = value.split('=');
      const section = tokens[0];
      const data = tokens[1];

      switch (section) {
        case 'Caption':
          mounted = data;
          newDiskIteration = true;
          break;
        case 'Description':
          fileSystem = data;
          break;
        case 'FreeSpace':
          freeSpace = isNaN(parseFloat(data)) ? 0 : convertToMB(+data);
          break;
        case 'Size':
          totalSpace = isNaN(parseFloat(data)) ? 0 : convertToMB(+data);
          break;
      }

    } else {

      if (newDiskIteration) {
        const usedSpace = (totalSpace - freeSpace);
        let usedSpacePercent = 0;

        if (size > 0) {
          usedSpacePercent = Math.round((usedSpace / totalSpace) * 100);
        }
        const freeSpacePercent = 100 - usedSpacePercent;
        const drive = { fileSystem, totalSpace, usedSpace, freeSpace, usedSpacePercent, freeSpacePercent, mounted };
        drives.push(drive);
        totalDiskSpace += drive.totalSpace;
        totalUsedSpace += drive.usedSpace;
        newDiskIteration = false;
        caption = '';
        description = '';
        freeSpace = 0;
        size = 0;
      }

    }

  });

  return {
    totalSpace: totalDiskSpace,
    usedSpace: totalUsedSpace,
    freeSpace: totalDiskSpace - totalUsedSpace,
    drives
  }
}

// get character encoding for the host system
function getEncoding() {
  const chcp = execSync('chcp').toString().split(':')[1].trim();
  let encoding = '';

  switch (chcp) {
    case '65000': // UTF-7
      encoding = 'UTF-7';
      break;
    case '65001': // UTF-8
      encoding = 'UTF-8';
      break;
    default: // Other Encoding
      if (/^-?[\d.]+(?:e-?\d+)?$/.test(chcp)) {
        encoding = 'cp' + chcp;
      } else {
        encoding = chcp;
      }
  }
  return encoding;
}


function convertToMB(bytes) {
  if (!bytes) return 0;
  return Math.ceil(bytes / 1024 / 1024);
}