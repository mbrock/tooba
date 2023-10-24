import React, { useState } from "react"

import { useObjectUrl } from "../../hooks"

import { FileGroup } from "./fileSystem"
import { videoUrlState } from "../video/VideoPlayer"
import { useRecoilState } from "recoil"
import { Tile } from "../mosaic/Mosaic"

interface FileGroupRendererProps {
  fileGroup: FileGroup
}

const FileGroupView: React.FC<FileGroupRendererProps> = ({ fileGroup }) => {
  const { files } = fileGroup

  const hasMP4 = files.hasOwnProperty("mp4")
  const hasTBN = files.hasOwnProperty("tbn")

  if (hasMP4 && hasTBN) {
    return (
      <VideoFileGroupView
        videoFile={files["mp4"]}
        thumbnailFile={files["tbn"]}
      />
    )
  }

  return <div>Unknown file group</div>
}

interface VideoFileGroupProps {
  videoFile: FileSystemFileHandle
  thumbnailFile: FileSystemFileHandle
}

const VideoFileGroupView: React.FC<VideoFileGroupProps> = ({
  videoFile: mp4File,
  thumbnailFile: tbnFile,
}) => {
  const thumbnailUrl = useObjectUrl(tbnFile)
  const [videoObjectUrl, setMp4ObjectUrl] = useState<string | null>(null)
  const [, setVideoUrl] = useRecoilState(videoUrlState)

  const handleClick = async () => {
    if (!videoObjectUrl) {
      const url = URL.createObjectURL(await mp4File.getFile())
      setMp4ObjectUrl(url)
      setVideoUrl(url)
    }
  }

  return (
    <Tile onClick={handleClick}>
      {thumbnailUrl && (
        <img src={thumbnailUrl} className="inline-block rounded-lg w-96" />
      )}
    </Tile>
  )
}

export default FileGroupView
