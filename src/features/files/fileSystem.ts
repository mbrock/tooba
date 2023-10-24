import { atom, selector } from 'recoil';
import { Folder, loadFileSystem } from './directoryScanner';

export interface FileGroup {
  baseName: string; // e.g., "foo.s01e01.svtplay"
  files: { [extension: string]: FileSystemFileHandle };
}

export interface GroupedFolder {
  name: string;
  files: FileGroup[];
  folders: GroupedFolder[];
}

function groupFiles(files: FileSystemFileHandle[]): FileGroup[] {
  const groups: { [key: string]: FileGroup } = {};

  files.forEach((file) => {
    const parts = file.name.split('.');
    const extension = parts.pop() || '';
    const baseName = parts.join('.');

    if (!groups[baseName]) {
      groups[baseName] = { baseName, files: {} };
    }
    groups[baseName].files[extension] = file;
  });

  return Object.values(groups).sort((a, b) => a.baseName.localeCompare(b.baseName));
}

function groupFolder(folder: Folder): GroupedFolder {
  return {
    name: folder.name,
    files: groupFiles(folder.files),
    folders: folder.folders.map(groupFolder),
  };
}

export const fileSystemState = atom({
  key: 'fileSystemState',
  default: null as GroupedFolder | null,
});

export const fetchFileSystem = selector({
  key: 'fetchFileSystem',
  get: async () => {
    const folder = await loadFileSystem();
    return groupFolder(folder);
  },
});
