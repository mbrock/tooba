import { useRecoilState } from "recoil"

import { FileSystemViewer } from "./features/files/FileSystemViewer"
import { VideoPlayer, videoUrlState } from "./features/video/VideoPlayer"
import { MealPlan } from "./features/meals/MealPlan"
import { GamepadListener, gamepadNavigationHandler } from "./gamepad"

function App() {
  const [videoUrl, setVideoUrl] = useRecoilState(videoUrlState)
  const onButtonPress = gamepadNavigationHandler(
    {
      rowSelector: ".overflow-x-auto",
      targetSelector: "a",
    },
    {
      A: (el) => el.click(),
      B: () => setVideoUrl(null),
    },
  )

  return (
    <>
      <nav className="flex flex-col flex-grow gap-8 overflow-y-auto">
        <MealPlan />
        <FileSystemViewer />
      </nav>
      {videoUrl && <VideoPlayer key={videoUrl} videoUrl={videoUrl} />}
      <GamepadListener onButtonPress={onButtonPress} />
    </>
  )
}

export default App
