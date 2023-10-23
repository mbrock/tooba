import React, { useState } from "react"
import { FileGroup } from "./fileSystemSlice"
import { useObjectUrl } from "../../app/hooks"
import { useAppDispatch } from "../../app/hooks"
import { setVideoUrl } from "../video/videoSlice"

interface FileGroupRendererProps {
  fileGroup: FileGroup
}

const FileGroupView: React.FC<FileGroupRendererProps> = ({ fileGroup }) => {
  const { files } = fileGroup

  const hasMP4 = files.hasOwnProperty("mp4")
  const hasTBN = files.hasOwnProperty("tbn")

  if (hasMP4 && hasTBN) {
    return <VideoFileGroupView mp4File={files["mp4"]} tbnFile={files["tbn"]} />
  }

  return <div>Unknown file group</div>
}

interface VideoFileGroupProps {
  mp4File: FileSystemFileHandle
  tbnFile: FileSystemFileHandle
}

const VideoFileGroupView: React.FC<VideoFileGroupProps> = ({
  mp4File,
  tbnFile,
}) => {
  const tbnObjectUrl = useObjectUrl(tbnFile)
  const [mp4ObjectUrl, setMp4ObjectUrl] = useState<string | null>(null)
  const dispatch = useAppDispatch()

  const handleClick = async () => {
    if (!mp4ObjectUrl) {
      const url = URL.createObjectURL(await mp4File.getFile())
      setMp4ObjectUrl(url)
      dispatch(setVideoUrl(url))
    }
  }

  return (
    <button onClick={handleClick}>
      {tbnObjectUrl && <img src={tbnObjectUrl} className="inline-block" />}
    </button>
  )
}

export default FileGroupView
