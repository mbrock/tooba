import { useEffect, useRef, useState } from "react"
import { atom, useRecoilState } from "recoil"

export const videoUrlState = atom<string | null>({
  key: "videoUrlState",
  default: null,
})

export function seek(seconds: number) {
  const video = document.querySelector("video")
  if (video) {
    video.currentTime += seconds
  }
}

export function VideoPlayer({
  videoUrl,
  stop,
}: {
  videoUrl: string | null
  stop: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [inPiP, setInPiP] = useState(false)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen()
    }
  }

  // useEffect(() => {
  //   const handleFullscreenChange = () => {
  //     if (document.fullscreenElement === null && videoRef.current) {
  //       videoRef.current.requestPictureInPicture()
  //     }
  //   }

  //   const handleEnterPiP = () => {
  //     setInPiP(true)
  //   }

  //   const handleLeavePiP = () => {
  //     setInPiP(false)
  //     stop()
  //   }

  //   const video = videoRef.current
  //   if (video) {
  //     video.addEventListener("enterpictureinpicture", handleEnterPiP)
  //     video.addEventListener("leavepictureinpicture", handleLeavePiP)
  //   }
  //   document.addEventListener("fullscreenchange", handleFullscreenChange)

  //   return () => {
  //     if (video) {
  //       video.removeEventListener("enterpictureinpicture", handleEnterPiP)
  //       video.removeEventListener("leavepictureinpicture", handleLeavePiP)
  //     }
  //     document.removeEventListener("fullscreenchange", handleFullscreenChange)
  //   }
  // }, [])

  return (
    <video
      className={`w-full border-t-8 border-gray-800 h-1/2 ${
        !videoUrl ? "hidden" : ""
      }`}
      controls
      src={videoUrl || undefined}
      onEnded={stop}
      onPlay={handlePlay}
      ref={videoRef}
      autoPlay
    />
  )
}
