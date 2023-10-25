import { atom, selector } from "recoil"
import { Folder, loadFileSystem } from "./directoryScanner"
import { g } from "vitest/dist/types-e3c9754d.js"

export interface FileGroup {
  baseName: string // e.g., "foo.s01e01.svtplay"
  files: {
    [extension: string]: {
      handle: FileSystemFileHandle
      text?: string
    }
  }
}

export interface GroupedFolder {
  name: string
  files: FileGroup[]
  folders: GroupedFolder[]
}

async function groupFiles(files: FileSystemFileHandle[]): Promise<FileGroup[]> {
  const groups: { [key: string]: FileGroup } = {}

  for (const file of files) {
    const parts = file.name.split(".")
    const extension = parts.pop() || ""
    const baseName = parts.join(".")

    if (!groups[baseName]) {
      groups[baseName] = { baseName, files: {} }
    }

    groups[baseName].files[extension] = {
      handle: file,
    }

    if (["nfo", "srt"].includes(extension)) {
      groups[baseName].files[extension].text = await file
        .getFile()
        .then((f) => f.text())
    }
  }

  return Object.values(groups).sort((a, b) =>
    b.baseName.localeCompare(a.baseName),
  )
}

async function groupFolder(folder: Folder): Promise<GroupedFolder> {
  return {
    name: folder.name,
    files: await groupFiles(folder.files),
    folders: await Promise.all(
      folder.folders.map(async (f) => await groupFolder(f)),
    ),
  }
}

export const fileSystemState = atom({
  key: "fileSystemState",
  default: null as GroupedFolder | null,
})

export const fetchFileSystem = selector({
  key: "fetchFileSystem",
  get: async () => {
    const folder = await loadFileSystem()
    return await groupFolder(folder)
  },
})
