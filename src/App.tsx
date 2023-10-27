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
import PanelLayout from "./features/plywood"

const Plywood: React.FC = () => {
  const panel: [number, number] = [1250, 2500]
  const cuts: [number, number][] = [
    [460, 1071.5], // Side pieces
    [460, 1071.5], // Side pieces
    [658, 1071.5], // Back piece
    [658, 460], // Top piece
    [658, 460], // Bottom piece
  ]
  const numUnits = 1
  const kerfWidth = 3

  return (
    <div>
      <PanelLayout
        panel={panel}
        cuts={cuts}
        numUnits={numUnits}
        kerfWidth={kerfWidth}
      />
    </div>
  )
}

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
        {/* <TileGroup>
          <Tile onClick={(e) => (e.target as HTMLElement).requestFullscreen()}>
            <Plywood />
          </Tile>
        </TileGroup> */}
        <FileSystemViewer />
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
