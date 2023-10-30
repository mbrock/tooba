// This module can be used to scan a directory and return a structure
// containing all files and subdirectories. It uses the new File System Access API
// and the IndexedDB Key-Value API.
//
// The File System Access API is currently only supported in Chrome 86+.
//
// A reference to the directory handle is stored in IndexedDB so that the user
// doesn't have to select the directory every time.
//
// Note that while the handle is stored in IndexedDB, the file system can only
// be accessed after a user gesture (e.g. a click) because of security reasons.
//
// The structure of this module isn't very good. It's just a quick proof of concept.

import { get, set } from "idb-keyval"

export interface Folder {
  name: string
  files: FileSystemFileHandle[]
  folders: Folder[]
}

// Function to scan directory and populate structure
async function scanDirectory(
  dirHandle: FileSystemDirectoryHandle,
): Promise<Folder> {
  const folder: Folder = { name: dirHandle.name, files: [], folders: [] }

  const entries = await (dirHandle as any).values() // FIXME
  for await (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    if (entry.kind === "file") {
      folder.files.push(entry)
    } else if (entry.kind === "directory") {
      const subfolder = await scanDirectory(entry as FileSystemDirectoryHandle)
      folder.folders.push(subfolder)
    }
  }
  return folder
}

export async function loadFileSystem(): Promise<Folder> {
  let dirHandle = await get("dirHandle")
  if (!dirHandle) {
    dirHandle = await (window as any).showDirectoryPicker()
    if (!dirHandle) throw new Error("No directory handle")
    await set("dirHandle", dirHandle)
  }
  await dirHandle.requestPermission({ mode: "read" })
  return scanDirectory(dirHandle)
}
