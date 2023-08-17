import { platform as detectPlatform } from 'node:os';
import { Darwin } from './darwin.js';
import { Linux } from './linux.js';
const platform = detectPlatform().toLowerCase();

export const getDriveInfo = async () => {
  console.log("Detected platform: ", platform);
  switch (platform) {
    case "darwin":
      return Darwin.run();
    case "linux":
      return Linux.run();
    case "win32":
      break;
    default:
      throw new Error("Platform not supported");
  }
}

(async () => {
  console.log(await getDriveInfo())
})()