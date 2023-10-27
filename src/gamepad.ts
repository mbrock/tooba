import { useEffect, useRef } from "react"

interface GamepadListenerProps {
  onButtonPress: (gamepad: Gamepad, button: number) => void
}

export const GamepadListener: React.FC<GamepadListenerProps> = ({
  onButtonPress,
}) => {
  const prevButtonStates = useRef<boolean[]>([])
  const exitFlag = useRef(false)

  useEffect(() => {
    const checkGamepadButtons = () => {
      if (exitFlag.current) return
      const gamepad = navigator.getGamepads()[0]
      if (gamepad) {
        gamepad.buttons.forEach((button, index) => {
          const isPressed = button.pressed
          const wasPressed = prevButtonStates.current[index] || false

          if (isPressed && !wasPressed) {
            onButtonPress(gamepad, index)
          }

          prevButtonStates.current[index] = isPressed
        })
      }

      requestAnimationFrame(checkGamepadButtons)
    }

    // Initialize polling loop
    checkGamepadButtons()

    return () => {
      // Set exit flag for cleanup
      // exitFlag.current = true;
      console.log("exitFlag.current")
    }
  }, [onButtonPress])

  return null
}

interface ButtonCallbacks {
  A: (el: HTMLElement) => void
  B: (el: HTMLElement) => void
  LB: (el: HTMLElement) => void
  RB: (el: HTMLElement) => void
}

interface GamepadModuleConfig {
  rowSelector: string
  targetSelector: string
}

interface ButtonMap {
  [key: number]: keyof ButtonCallbacks | "Up" | "Down" | "Left" | "Right"
}

const focusElement = (el: Element) => {
  console.log("focusElement", el)
  ;(el as HTMLElement).focus({ preventScroll: true })
}

type ArrowButton = "Up" | "Down" | "Left" | "Right"

const findRowElement = (
  element: HTMLElement,
  rows: HTMLElement[],
): HTMLElement | null => {
  return rows.find((row) => row.contains(element)) || null
}

const navigateRow = (
  direction: "Up" | "Down",
  rows: HTMLElement[],
  focusedElement: HTMLElement,
) => {
  const currentRow = findRowElement(focusedElement, rows)
  const rowIndex = currentRow ? rows.indexOf(currentRow) : -1
  const nextRowIndex = direction === "Up" ? rowIndex - 1 : rowIndex + 1

  if (nextRowIndex >= 0 && nextRowIndex < rows.length) {
    const nextRow = rows[nextRowIndex]
    const targetElement = nextRow.querySelector("a:first-child")
    if (targetElement) {
      focusElement(targetElement)
    }
  }
}

const focusSibling = (reverse: boolean) => {
  // Use tabindex 0 to find all focusable elements
  const focusableElements = Array.from(
    document.querySelectorAll("[tabindex='0']"),
  ) as HTMLElement[]
  const focusedElement = document.activeElement as HTMLElement
  const focusedElementIndex = focusableElements.indexOf(focusedElement)
  const nextIndex = reverse ? focusedElementIndex - 1 : focusedElementIndex + 1
  // Wrap around when reaching the end of the list
  const nextElement =
    nextIndex >= 0 && nextIndex < focusableElements.length
      ? focusableElements[nextIndex]
      : focusableElements[reverse ? focusableElements.length - 1 : 0]

  if (nextElement) {
    focusElement(nextElement)
  }
}

type ScrollOptions = {
  axis: "x" | "y"
  overflowClass: string
}

const scrollToCenter = (
  focusedElement: HTMLElement,
  options: ScrollOptions,
) => {
  const container = focusedElement.closest(`.${options.overflowClass}`)
  if (container) {
    const containerRect = container.getBoundingClientRect()
    const elementRect = focusedElement.getBoundingClientRect()
    const offset =
      options.axis === "x"
        ? elementRect.left - containerRect.left
        : elementRect.top - containerRect.top
    const containerSize =
      options.axis === "x" ? containerRect.width : containerRect.height
    const elementSize =
      options.axis === "x" ? elementRect.width : elementRect.height

    const scrollOptions: ScrollToOptions = {
      behavior: "smooth",
    }

    scrollOptions[options.axis === "x" ? "left" : "top"] =
      container[options.axis === "x" ? "scrollLeft" : "scrollTop"] +
      offset -
      containerSize / 2 +
      elementSize / 2

    container.scrollTo(scrollOptions)
  }
}

const navigate = (
  direction: "Up" | "Down" | "Left" | "Right",
  config: GamepadModuleConfig,
  focusedElement: HTMLElement,
) => {
  const rows = Array.from(
    document.querySelectorAll(config.rowSelector),
  ) as HTMLElement[]

  if (direction === "Up" || direction === "Down") {
    navigateRow(direction, rows, focusedElement)
  } else {
    focusSibling(direction === "Left")
  }

  const focusedElement2 = document.activeElement as HTMLElement
  if (focusedElement2) {
    scrollToCenter(focusedElement2, {
      axis: "x",
      overflowClass: "overflow-x-auto",
    })
    scrollToCenter(focusedElement2, {
      axis: "y",
      overflowClass: "overflow-y-auto",
    })
  }
}

/**
 * Returns a function that handles gamepad navigation based on the given configuration and button callbacks.
 *
 * It handles the arrow buttons and delegates other buttons to callbacks.
 */
export const gamepadNavigationHandler = (
  config: GamepadModuleConfig,
  buttonCallbacks: ButtonCallbacks,
) => {
  const buttonMap: ButtonMap = {
    0: "A",
    1: "B",
    4: "LB",
    5: "RB",
    12: "Up",
    13: "Down",
    14: "Left",
    15: "Right",
  }

  return (gamepad: Gamepad, button: number) => {
    if (!document.activeElement || document.activeElement === document.body) {
      const firstElement = document.querySelector(config.targetSelector)
      if (firstElement) {
        focusElement(firstElement)
      } else {
        return
      }
    }

    const focusedElement = document.activeElement as HTMLElement
    const action = buttonMap[button]

    console.log({ button, action, focusedElement })

    if (["Up", "Down", "Left", "Right"].includes(action)) {
      navigate(action as ArrowButton, config, focusedElement)
    } else {
      if (focusedElement) {
        buttonCallbacks[action as keyof ButtonCallbacks](focusedElement)
      }
    }
  }
}
