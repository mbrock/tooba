import React, { useState } from "react"

import { useFileHandleContent, useObjectUrl } from "../../hooks"

import { FileGroup } from "./fileSystem"
import { videoUrlState } from "../video/VideoPlayer"
import { selectorFamily, useRecoilState } from "recoil"
import { Tile } from "../mosaic/Mosaic"

interface FileGroupRendererProps {
  fileGroup: FileGroup
}

const FileGroupView: React.FC<FileGroupRendererProps> = ({ fileGroup }) => {
  const { files } = fileGroup

  const hasMP4 = files.hasOwnProperty("mp4")
  const hasTBN = files.hasOwnProperty("tbn")

  const hasNFO = files.hasOwnProperty("nfo")
  const nfoData = hasNFO ? parseNfoXml(files["nfo"].text ?? "") : undefined

  if (hasMP4 && hasTBN) {
    return (
      <VideoFileGroupView
        videoFile={files["mp4"].handle}
        thumbnailFile={files["tbn"].handle}
        nfoData={nfoData}
      />
    )
  }
  return null
  return (
    <Tile onClick={() => {}}>
      <div className="flex flex-col gap-1 w-96">
        <h3 className="mt-1 font-bold">{fileGroup.baseName}</h3>
      </div>
    </Tile>
  )
}

interface VideoFileGroupProps {
  videoFile: FileSystemFileHandle
  thumbnailFile: FileSystemFileHandle
  nfoData?: NfoData
}

type NfoField = "title" | "showtitle" | "season" | "plot" | "aired"
type NfoData = Record<NfoField, string | null>

const parseNfoXml = (xmlString: string): NfoData => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, "application/xml")

  const fields: NfoField[] = ["title", "showtitle", "season", "plot", "aired"]
  const values = fields.map((field) => {
    const node = xmlDoc.getElementsByTagName(field)[0]
    return node ? node.textContent : null
  })

  return Object.fromEntries(
    fields.map((field, i) => [field, values[i]]),
  ) as NfoData
}

const VideoFileGroupView: React.FC<VideoFileGroupProps> = ({
  videoFile: mp4File,
  thumbnailFile: tbnFile,
  nfoData,
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

  const ImageThumbnail = ({ url }: { url: string | null }) => {
    if (!url) return null
    return <img src={url} className="inline-block rounded-lg" />
  }

  const TitleText = ({ text }: { text?: string | null }) => {
    if (!text) return null
    return <h3 className="mt-1 font-bold">{text}</h3>
  }

  const PlotText = ({ text }: { text?: string | null }) => {
    if (!text) return null
    return <p>{text}</p>
  }

  interface FieldProps<T> {
    data: T | null
    render: (data: T) => JSX.Element
  }

  function OptionalField<T>({ data, render }: FieldProps<T>) {
    if (data == null) return null
    return render(data)
  }

  function formatDateToSwedish(date: Date): string {
    const now = new Date()
    const dayDifference = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 3600 * 24),
    )

    const weekdays = [
      "söndag",
      "måndag",
      "tisdag",
      "onsdag",
      "torsdag",
      "fredag",
      "lördag",
    ]

    switch (dayDifference) {
      case 0:
        return "idag"
      case 1:
        return "igår"
      case 2:
        return "i förrgår"
      default:
        if (dayDifference > 2 && dayDifference < 7) {
          return `i ${weekdays[date.getDay()]}s`
        } else {
          return date.toLocaleDateString("sv-SE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        }
    }
  }

  const DateView = ({ date }: { date?: string | null }) => {
    if (!date) return null
    const dateObj = new Date(date)
    return (
      <p className="text-gray-500 dark:text-gray-400">
        {formatDateToSwedish(dateObj)}
      </p>
    )
  }

  return (
    <Tile onClick={handleClick}>
      <div className="flex flex-col gap-1 w-96">
        <OptionalField
          data={thumbnailUrl}
          render={(url) => (
            <img src={url} className="inline-block rounded-lg" />
          )}
        />
        <div className="flex flex-col gap-1 mx-2">
          <OptionalField
            data={nfoData?.title}
            render={(text) => <h3 className="mt-1 font-bold">{text}</h3>}
          />
          {/* <OptionalField
            data={nfoData?.plot}
            render={(text) => <p>{text}</p>}
          /> */}
          <OptionalField
            data={nfoData?.aired}
            render={(text) => <DateView date={text} />}
          />
        </div>
      </div>
    </Tile>
  )
}

export default FileGroupView
