import { useRecoilState } from "recoil"

import { FileSystemViewer } from "./features/files/FileSystemViewer"
import { VideoPlayer, videoUrlState } from "./features/video/VideoPlayer"
import { MealPlan } from "./features/meals/MealPlan"
import GamepadListener from "./gamepad"

function App() {
  const [videoUrl, setVideoUrl] = useRecoilState(videoUrlState)
  const onButtonPress = (gamepad: Gamepad, button: number) => {
    console.log(gamepad, button)

    if (button === 0) {
      console.log("a")
      const focusedElement = document.activeElement as HTMLElement
      if (focusedElement) {
        focusedElement.click()
      }
    } else if (button === 1) {
      setVideoUrl(null)
    } else if (button === 12) {
      console.log("up")

      const focusedElement = document.activeElement as HTMLElement
      // now we have to look for the previous row and focus the last element in it
      // the rows are characterized by having overflow-x-auto
      // first get a flat array of all the rows
      const rows = Array.from(
        document.querySelectorAll(".overflow-x-auto"),
      ) as HTMLElement[]
      // then find the index of the row that contains the focused element
      const focusedRowIndex = rows.findIndex((row) =>
        row.contains(focusedElement),
      )
      // then find the previous row
      const previousRow = rows[focusedRowIndex - 1]
      // and focus the first element in it
      if (previousRow) {
        const firstElement = previousRow.querySelector("a:first-child")
        console.log(firstElement)
        if (firstElement) {
          ;(firstElement as HTMLElement).focus({ preventScroll: true })
        }
      }
    } else if (button === 13) {
      console.log("down")

      const focusedElement = document.activeElement as HTMLElement
      // now we have to look for the next row and focus the first element in it
      // the rows are characterized by having overflow-x-auto
      // first get a flat array of all the rows
      const rows = Array.from(
        document.querySelectorAll(".overflow-x-auto"),
      ) as HTMLElement[]

      // then find the index of the row that contains the focused element
      const focusedRowIndex = rows.findIndex((row) =>
        row.contains(focusedElement),
      )

      // then find the next row
      const nextRow = rows[focusedRowIndex + 1]
      // and focus the first element in it
      if (nextRow) {
        const firstElement = nextRow.querySelector("a")
        console.log(firstElement)
        if (firstElement) {
          ;(firstElement as HTMLElement).focus({ preventScroll: true })
        }
      }
    } else if (button === 14) {
      console.log("left")

      const focusedElement = document.activeElement as HTMLElement
      if (focusedElement && focusedElement.tagName === "A") {
        console.log(focusedElement)
        const previousElement = focusedElement.previousElementSibling
        if (previousElement) {
          ;(previousElement as HTMLElement).focus({ preventScroll: true })
        }
      } else {
        const lastElement = document.querySelector("a:last-child")
        console.log(lastElement)
        if (lastElement) {
          ;(lastElement as HTMLElement).focus({ preventScroll: true })
        }
      }
    } else if (button === 15) {
      console.log("right")

      const focusedElement = document.activeElement as HTMLElement
      if (focusedElement && focusedElement.tagName === "A") {
        console.log(focusedElement)
        const nextElement = focusedElement.nextElementSibling
        if (nextElement) {
          ;(nextElement as HTMLElement).focus({ preventScroll: true })
        }
      } else {
        const firstElement = document.querySelector("a")
        console.log(firstElement)
        if (firstElement) {
          ;(firstElement as HTMLElement).focus({ preventScroll: true })
        }
      }
    }

    // now scroll the focused element into view nicely
    const focusedElement = document.activeElement as HTMLElement
    if (focusedElement) {
      {
        const container = focusedElement.closest(".overflow-x-auto")
        if (container) {
          const containerRect = container.getBoundingClientRect()
          const elementRect = focusedElement.getBoundingClientRect()
          const offset = elementRect.left - containerRect.left
          container.scrollTo({
            left:
              container.scrollLeft +
              offset -
              containerRect.width / 2 +
              elementRect.width / 2,
            behavior: "smooth",
          })
        }
      }
      {
        // handle overflow-y-auto
        const container = focusedElement.closest(".overflow-y-auto")
        if (container) {
          const containerRect = container.getBoundingClientRect()
          const elementRect = focusedElement.getBoundingClientRect()
          const offset = elementRect.top - containerRect.top
          container.scrollTo({
            top:
              container.scrollTop +
              offset -
              containerRect.height / 2 +
              elementRect.height / 2,
            behavior: "smooth",
          })
        }
      }
    }
  }

  return (
    <>
      <nav className="flex flex-col flex-grow gap-4 overflow-y-auto">
        <MealPlan />
        <FileSystemViewer />
      </nav>
      {videoUrl && <VideoPlayer key={videoUrl} videoUrl={videoUrl} />}
      <GamepadListener onButtonPress={onButtonPress} />
    </>
  )
}

export default App
