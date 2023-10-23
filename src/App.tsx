import "./App.css"

import { FileSystemViewer } from "./features/files/FileSystemViewer"
import { useAppSelector } from "./app/hooks"
import { VideoPlayer } from "./features/video/VideoPlayer"

function App() {
  const videoUrl = useAppSelector((state) => state.video.videoUrl)
  return (
    <div className="container grid grid-cols-1 gap-4 px-4 py-4 mx-auto mt-4 sm:px-6 lg:px-8">
      <FileSystemViewer />
      {videoUrl && <VideoPlayer key={videoUrl} videoUrl={videoUrl} />}
    </div>
  )
}

export default App
