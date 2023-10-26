import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { WhisperTranscription } from "./transcription"
import { editsFromStrings } from "./typewriter"
import {
  Observable,
  distinctUntilChanged,
  map,
  repeat,
  retry,
  scan,
  share,
  startWith,
  switchMap,
} from "rxjs"
import { useObservableState } from "observable-hooks"
import { typewriterEffect } from "./typewriterEffect"
import { Tile } from "../mosaic/Mosaic"

async function fetchTranscription(
  blob: Blob,
  apiKey: string,
): Promise<WhisperTranscription> {
  const formData = new FormData()
  formData.append("file", blob, "audio.webm")
  formData.append("model", "whisper-1")
  formData.append("response_format", "verbose_json")

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    },
  )

  const data: WhisperTranscription = await response.json()
  return data
}

interface Line {
  text: string
  final: boolean
  certainty: number
}

function doSpeechRecognition(speech: SpeechRecognition): Observable<Line> {
  return new Observable<Line>((line$) => {
    speech.onresult = (event) => {
      const result = event.results[event.results.length - 1]
      const { transcript, confidence } = result[0]
      const { isFinal } = result

      line$.next({
        text: transcript,
        final: isFinal,
        certainty: confidence,
      })
    }

    speech.onerror = (event) => {
      line$.error(event.error)
    }

    speech.onend = () => {
      console.log("speech recognition ended")
      line$.complete()
    }

    speech.start()
  })
}

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

const makeSpeechRecognition = (): SpeechRecognition => {
  console.info("making speech recognition")
  const speech = new SpeechRecognition()
  speech.lang = "sv-SE"
  speech.continuous = true
  speech.interimResults = true
  return speech
}

const LineView: React.FC<{ line: Line; className: string }> = ({
  line,
  className,
}) => {
  const getBorderColor = ({ certainty, final, text }: Line) => {
    if (text == "") return "border-gray-800 h-6"
    if (!final) return "border-gray-600"
    if (certainty > 0.9) return "border-green-600"
    if (certainty > 0.66) return "border-yellow-600"
    if (certainty > 0.33) return "border-orange-600"

    return "border-red-600"
  }

  const border = getBorderColor(line)

  console.log(line)

  return (
    <Tile onClick={() => {}}>
      <span
        className={`transition ease-in-out delay-150 lowercase border-l-4 px-2 mr-4 pb-0.5 leading-6 ${border} ${className}`}
      >
        {line.text || " "}
      </span>
    </Tile>
  )
}

export const SpeechRecognitionDisplay: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false)
  const [history$, text$] = useSpeechRecognitionLogic(isStarted)
  const history = useObservableState(history$, [])
  const text = useObservableState(text$, "")
  const lastIndex = history.length - 1

  useLayoutEffect(() => {
    // scroll the last line into view
    const lastLine = document.querySelector(".last-line")
    if (lastLine) {
      lastLine.scrollIntoView({ behavior: "smooth" })
      // find its nearest parent with tabindex=0 and focus it
      const focusableParent = lastLine.closest(
        "[tabindex='0']",
      ) as HTMLElement | null
      if (focusableParent) {
        focusableParent.focus()
      }
    }
  }, [history, text])

  if (!isStarted) {
    return <Tile onClick={() => setIsStarted(true)}>🎙️</Tile>
  }

  return (
    <>
      {history.slice(0, -1).map((line, index) => (
        <LineView key={index} line={line} className={"text-gray-400"} />
      ))}
      <LineView
        key={lastIndex}
        line={{ text, final: false, certainty: 0 }}
        className="text-gray-600 last-line"
      />
    </>
  )
}

function useSpeechRecognitionLogic(
  isStarted: boolean,
): [Observable<Line[]>, Observable<string>] {
  const [state, setState] = useState<{
    history$: Observable<Line[]>
    text$: Observable<string>
  }>({
    history$: new Observable<Line[]>(),
    text$: new Observable<string>(),
  })

  useEffect(() => {
    if (!isStarted) return

    const speech = makeSpeechRecognition()
    const emptyLine = { text: "", final: false, certainty: 0 }
    const history$ = doSpeechRecognition(speech).pipe(
      repeat(),
      retry({ count: 5, delay: 100, resetOnSuccess: true }),
      startWith(emptyLine),
      scan(
        (history, line) =>
          line.final
            ? [...history.slice(0, -1), line, emptyLine]
            : [...history.slice(0, -1), line],
        [] as Line[],
      ),
      share(),
    )

    const currentLine$ = history$.pipe(
      map((history) => history[history.length - 1]),
      share(),
    )

    const newText$: Observable<boolean> = currentLine$.pipe(
      map((line) => line.text.length == 0),
      distinctUntilChanged(),
    )

    const text$ = newText$.pipe(
      switchMap((newText) => {
        console.log("newText", newText)
        return currentLine$.pipe(
          map((line) => line.text),
          editsFromStrings,
          (edits$) => typewriterEffect(edits$, 20),
          startWith(""),
        )
      }),
    )

    setState({ history$, text$ })
  }, [isStarted])

  return [state.history$, state.text$]
}
