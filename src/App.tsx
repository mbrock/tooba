import { useRecoilState } from "recoil"

import { FileSystemViewer } from "./features/files/FileSystemViewer"
import { VideoPlayer, seek, videoUrlState } from "./features/video/VideoPlayer"
import { MealPlan } from "./features/meals/MealPlan"
import { GamepadListener, gamepadNavigationHandler } from "./gamepad"
import UserInteractionInitializer from "./features/UserInteractionInitializer"
import { useCallback, useMemo } from "react"
import { SpeechRecognitionDisplay } from "./features/voice/SpeechRecognitionDisplay"
import { Tile, TileGroup } from "./features/mosaic/Mosaic"
import Polygon from "./features/Polygon"

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
      <nav className="flex flex-col flex-grow gap-8 mb-8 overflow-y-auto">
        <MealPlan />
        <TileGroup>
          {Array.from({ length: 100 }, (_, i) => (
            <Tile onClick={() => {}} key={i}>
              <Polygon key={i} sides={i + 3} radius={100} />
              <h2>{i + 3}</h2>
            </Tile>
          ))}
        </TileGroup>
        <FileSystemViewer />
      </nav>
      {videoUrl && (
        <VideoPlayer
          key={videoUrl}
          videoUrl={videoUrl}
          stop={() => setVideoUrl(null)}
        />
      )}
      <GamepadListener onButtonPress={onButtonPress} />
    </>
  )
}

export default App
