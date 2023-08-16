// represents a drive
export class Drive {
  constructor(filesystem, blocks, used, available, mounted) {
    this._filesystem = filesystem;
    this._blocks = blocks;
    this._used = used;
    this._available = available;
    this._mounted = mounted;
  }

  get filesystem() {
    return this._filesystem;
  }

  get blocks() {
    return this._blocks;
  }

  get used() {
    return this._used;
  }

  get available() {
    return this._available;
  }

  get mounted() {
    return this._mounted
  }
};