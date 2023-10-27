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
      {level > 0 && (
        <header className="flex flex-row items-center gap-4 mb-1 ml-4">
          <h1 className="text-2xl font-bold text-gray-300 uppercase">
            {folder.name.replace(/\./g, " ")}
          </h1>
          <span className="text-lg text-gray-500">{folder.files.length}</span>
        </header>
      )}
      <div className="flex flex-col gap-6">
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
          className="px-4 py-2 mx-auto text-2xl font-bold text-white bg-blue-500 rounded-xl hover:bg-blue-700 w-min"
          onClick={handleOpenFolder}
        >
          START 🥳
        </button>
      ) : (
        <>{renderFolder(fileSystem)}</>
      )}
    </>
  )
}
