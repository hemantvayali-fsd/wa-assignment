import { execSync } from 'node:child_process';

export const exec = (command) => {
  return execSync(command, { windowsHide: true, encoding: 'buffer' }).toString()
}