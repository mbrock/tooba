import { useRef } from "react"
import { atom, useRecoilState } from "recoil"

export const videoUrlState = atom<string | null>({
  key: "videoUrlState",
  default: null,
})

export function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen()
    }
  }

  return (
    <video
      className="w-full border-t-8 border-gray-800 h-1/2"
      controls
      src={videoUrl}
      onEnded={() => console.log("ended")}
      onPlay={handlePlay}
      ref={videoRef}
      autoPlay
    />
  )
}
