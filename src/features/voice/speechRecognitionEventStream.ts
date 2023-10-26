import { Observable } from "rxjs"

interface ResultEvent {
  type: "Result"
  timestamp: string
}

interface TranscriptEvent {
  type: "Transcript"
  transcript: string
  grade?: string
  timestamp: string
  id: string
}

interface NoSpeechEvent {
  type: "NoSpeech"
  timestamp: string
}

interface NetworkDownEvent {
  type: "NetworkDown"
}

export type SpeechEvent =
  | ResultEvent
  | TranscriptEvent
  | NoSpeechEvent
  | NetworkDownEvent

export function speechRecognitionEventStream({
  language = "en-US",
}): Observable<SpeechEvent> {
  return new Observable((observer) => {
    const recognition = new webkitSpeechRecognition()
    recognition.interimResults = true
    recognition.continuous = true
    recognition.lang = language

    console.log(recognition)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log(event)
      const timestamp = new Date().toISOString()
      observer.next({ type: "Result", timestamp })

      Array.from(event.results)
        .slice(event.resultIndex)
        .forEach((result) => {
          observer.next({
            type: "Transcript",
            transcript: result[0].transcript,
            grade: result.isFinal
              ? confidenceGrade(result[0].confidence)
              : undefined,
            timestamp,
            id: gensym(),
          })
        })
    }

    recognition.onerror = (error: { error: string }) => {
      console.error(error)
      if (error.error === "no-speech") {
        observer.next({ type: "NoSpeech", timestamp: new Date().toISOString() })
      } else if (error.error === "network") {
        observer.next({ type: "NetworkDown" })
      } else {
        observer.error(error)
      }
    }

    recognition.onend = () => {
      // recognition.start()
    }

    recognition.start()
    console.log("started")

    // Cleanup
    return () => {
      console.log("cleanup")
      recognition.stop()
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
    }
  })
}

type Grade = "A+" | "A" | "B" | "C" | "D" | "F"

function confidenceGrade(confidence: number): Grade {
  let grade: Grade = "F"

  if (confidence > 0.95) {
    grade = "A+"
  } else if (confidence > 0.9) {
    grade = "A"
  } else if (confidence > 0.8) {
    grade = "B"
  } else if (confidence > 0.7) {
    grade = "C"
  } else if (confidence > 0.6) {
    grade = "D"
  }

  return grade
}

function zb32word() {
  const base = "ybndrfg8ejkmcpqxot1uwisza345h769"
  const array = new Int32Array(1)
  window.crypto.getRandomValues(array)
  const i = array[0]

  return (
    base[(i >>> 27) & 0x1f] +
    base[(i >>> 22) & 0x1f] +
    base[(i >>> 17) & 0x1f] +
    base[(i >>> 12) & 0x1f] +
    base[(i >>> 7) & 0x1f] +
    base[(i >>> 2) & 0x1f]
  )
}

function gensym() {
  return `${zb32word()}${zb32word()}`
}
