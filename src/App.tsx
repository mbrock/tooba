import { useRecoilState } from "recoil"

import { FileSystemViewer } from "./features/files/FileSystemViewer"
import { VideoPlayer, seek, videoUrlState } from "./features/video/VideoPlayer"
import { MealPlan } from "./features/meals/MealPlan"
import { GamepadListener, gamepadNavigationHandler } from "./gamepad"
import UserInteractionInitializer from "./features/UserInteractionInitializer"
import { useCallback, useMemo } from "react"
import { SpeechRecognitionDisplay } from "./features/voice/SpeechRecognitionDisplay"
import { TileGroup } from "./features/mosaic/Mosaic"

function App() {
  const [videoUrl, setVideoUrl] = useRecoilState(videoUrlState)
  const onButtonPress = useMemo(
    () =>
      gamepadNavigationHandler(
        {
          rowSelector: ".overflow-x-auto",
          targetSelector: "a",
        },
        {
          A: (el) => el.click(),
          B: () => setVideoUrl(null),
          LB: () => seek(-10),
          RB: () => seek(10),
        },
      ),
    [setVideoUrl],
  )

  return (
    <>
      <nav className="flex flex-col flex-grow gap-8 overflow-y-auto">
        <MealPlan />
        <FileSystemViewer />
        <TileGroup>
          <SpeechRecognitionDisplay />
        </TileGroup>
      </nav>
      {videoUrl && <VideoPlayer key={videoUrl} videoUrl={videoUrl} />}
      <GamepadListener onButtonPress={onButtonPress} />
    </>
  )
}

export default App
