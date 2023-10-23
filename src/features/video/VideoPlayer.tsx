import { useRef } from "react"

export function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen()
    }
  }

  return (
    <video
      className="w-full"
      controls
      src={videoUrl}
      onEnded={() => console.log("ended")}
      onPlay={handlePlay}
      ref={videoRef}
      autoPlay
    />
  )
}
