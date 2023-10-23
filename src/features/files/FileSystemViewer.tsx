import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { GroupedFolder, fetchFileSystem } from "./fileSystemSlice"
import FileGroupView from "./FileGroupView"

function renderFolder(folder: GroupedFolder, level = 0) {
  return (
    <div>
      <div className="flex flex-col gap-8 ml-4">
        {folder.folders.map((sub) => (
          <div key={sub.name}>{renderFolder(sub, level + 1)}</div>
        ))}
      </div>
      {folder.files.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {folder.files.map((file) => (
            <div key={file.baseName}>
              <FileGroupView fileGroup={file} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const FileSystemViewer = () => {
  const dispatch = useAppDispatch()
  const fileSystem = useAppSelector((state) => state.fileSystem)

  useEffect(() => {
    dispatch(fetchFileSystem())
  }, [dispatch])

  return (
    <div>
      {!fileSystem.folder ? (
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={() => dispatch(fetchFileSystem())}
        >
          📂 Open Folder
        </button>
      ) : (
        <>{renderFolder(fileSystem.folder)}</>
      )}
    </div>
  )
}
