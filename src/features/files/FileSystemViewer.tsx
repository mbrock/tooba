import React, { useEffect } from "react"
import { GroupedFolder, fetchFileSystem, fileSystemState } from "./fileSystem"
import {
  useRecoilCallback,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil"
import FileGroupView from "./FileGroupView"
import { TileGroup } from "../mosaic/Mosaic"

function renderFolder(folder: GroupedFolder, level = 0) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        {folder.folders.map((sub) => (
          <div key={sub.name}>{renderFolder(sub, level + 1)}</div>
        ))}
      </div>
      {folder.files.length > 0 && (
        <TileGroup>
          {folder.files.map((file) => (
            <FileGroupView key={file.baseName} fileGroup={file} />
          ))}
        </TileGroup>
      )}
    </div>
  )
}

export const FileSystemViewer = () => {
  const fileSystem = useRecoilValue(fileSystemState)

  const handleOpenFolder = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const fileSystem = await snapshot.getPromise(fetchFileSystem)
        set(fileSystemState, fileSystem)
      },
  )

  return (
    <>
      {!fileSystem ? (
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={handleOpenFolder}
        >
          📂 Open Folder
        </button>
      ) : (
        <>{renderFolder(fileSystem)}</>
      )}
    </>
  )
}
