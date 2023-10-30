import { useRecoilState } from "recoil"

import { FileSystemViewer } from "./features/files/FileSystemViewer"
import { VideoPlayer, seek, videoUrlState } from "./features/video/VideoPlayer"
import { MealPlan } from "./features/meals/MealPlan"
import { GamepadListener, gamepadNavigationHandler } from "./gamepad"
import { useCallback, useEffect, useMemo } from "react"
import { Tile, TileGroup } from "./features/mosaic/Mosaic"
import Polygon from "./features/Polygon"
import StopMotionCreator from "./features/stopmo"

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

  // install a document key handler for the escape button
  // to stop the video
  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVideoUrl(null)
      }
    },
    [setVideoUrl],
  )

  useEffect(() => {
    document.addEventListener("keyup", onKeyUp)
    return () => document.removeEventListener("keyup", onKeyUp)
  })

  return (
    <>
      <nav className="flex flex-col flex-grow gap-8 mb-8 overflow-y-auto">
        <MealPlan />
        {/* <TileGroup>
          <Tile onClick={(e) => (e.target as HTMLElement).requestFullscreen()}>
            <Plywood />
          </Tile>
        </TileGroup> */}

        <TileGroup>
          {Array.from({ length: 100 }, (_, i) => (
            <Tile onClick={() => {}} key={i}>
              <Polygon key={i} sides={i + 3} radius={100} />
              <h2>{i + 3}</h2>
            </Tile>
          ))}
        </TileGroup>
        <StopMotionCreator />
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

// So, this is a bit of a mess. I'm not sure how to make it better.
//
// I think something like Datalog might be a good fit for the data
// management, but I'm not sure how to make it work with React.
//
// I think the best thing to do is to start with the simplest thing that
// could possibly work, and then refactor it as I go.
//
// I think the simplest thing that could possibly work is to use a
// single global state atom, and then use selectors to derive the
// state for each component.
//
// The global state should be a set of facts, and the selectors should
// be thought of as queries.
//
// The facts can be persisted to IndexedDB, and the queries can be
// memoized.
//
// The queries can be used to render the components, and the components
// can dispatch actions to the global state.
//
// The actions can be thought of as mutations, and they can be
// implemented as transactions.
//
// The transactions can be persisted to IndexedDB.
//
// The transactions can be used to update the facts, and the facts can
// be used to update the queries.
//
// For example, our library of videos can be represented as a set of
// facts, here in Turtle with widely-used prefixes:
//
// @prefix : <#> .
// @prefix dc: <http://purl.org/dc/elements/1.1/>
// @prefix xsd: <http://www.w3.org/2001/XMLSchema#>
//
// :video-1 dc:title "Video 1" .
// :video-1 dc:source "https://example.com/video-1.mp4" .
// :video-1 dc:duration "PT1M"^^xsd:duration .
//
//2a,2    a
