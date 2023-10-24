import { get, set } from 'idb-keyval';

export interface Folder {
  name: string;
  files: FileSystemFileHandle[];
  folders: Folder[];
}

// Function to scan directory and populate structure
async function scanDirectory(dirHandle: FileSystemDirectoryHandle): Promise<Folder> {
  const folder: Folder = { name: dirHandle.name, files: [], folders: [] };
  const entries = await (dirHandle as any).values(); // FIXME
  for await (const entry of entries) {
    if (entry.kind === 'file') {
      folder.files.push(entry);
    } else if (entry.kind === 'directory') {
      const subfolder = await scanDirectory(entry as FileSystemDirectoryHandle);
      folder.folders.push(subfolder);
    }
  }
  return folder;
}

export async function loadFileSystem(): Promise<Folder> {
  let dirHandle = await get('dirHandle');
  if (!dirHandle) {
    dirHandle = await (window as any).showDirectoryPicker();
    if (!dirHandle) throw new Error('No directory handle');
    await set('dirHandle', dirHandle);
  }
  await dirHandle.requestPermission({ mode: 'read' });
  return scanDirectory(dirHandle);
}
