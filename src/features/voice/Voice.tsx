import React, { useEffect, useState } from "react"
import {
  speechRecognitionEventStream,
  SpeechEvent,
} from "./speechRecognitionEventStream"

interface FinalTranscriptLine extends CurrentTranscriptLine {
  grade: string
}

interface CurrentTranscriptLine {
  id: string
  timestamp: string
  text: string
}

interface LiveTranscriptProps {
  finalLines: FinalTranscriptLine[]
  currentLine: CurrentTranscriptLine | null
}

export function transformSpeechEventsToTranscript(
  events: SpeechEvent[],
): LiveTranscriptProps {
  let finalLines: FinalTranscriptLine[] = []
  let currentLine: CurrentTranscriptLine | null = null

  events.forEach((event) => {
    switch (event.type) {
      case "Result":
        break
      case "Transcript":
        if (event.grade) {
          const line: FinalTranscriptLine = {
            id: event.id,
            timestamp: event.timestamp,
            text: event.transcript,
            grade: event.grade,
          }
          finalLines.push(line)
        } else {
          currentLine = {
            id: event.id,
            timestamp: event.timestamp,
            text: event.transcript,
          }
        }
        break
      case "NoSpeech":
      case "NetworkDown":
        break
    }
  })

  return {
    finalLines,
    currentLine,
  }
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  finalLines,
  currentLine,
}) => {
  return (
    <div className="p-4 dark:bg-slate">
      <div className="font-semibold text-yellow dark:text-blue">
        Live Transcript
      </div>
      <div className="overflow-y-auto h-[300px] dark:bg-slate">
        {finalLines.map((line) => (
          <div key={line.id} className="text-yellow dark:text-blue">
            {line.text}{" "}
            <span className="text-sm text-gray-400">({line.grade})</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-yellow dark:text-blue">
        {currentLine ? currentLine.text : ""}
      </div>
    </div>
  )
}

export const Dictaphone: React.FC = () => {
  const [events, setEvents] = useState<SpeechEvent[]>([])

  const { finalLines, currentLine } = transformSpeechEventsToTranscript(events)

  useEffect(() => {
    const subscription = speechRecognitionEventStream({
      language: "en-US",
    }).subscribe({
      next: (event: SpeechEvent) => {
        setEvents((prevEvents) => [...prevEvents, event])
      },
      error: (err) => {
        console.error("Error in speech recognition:", err)
      },
    })

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe()
  }, [])

  return <LiveTranscript finalLines={finalLines} currentLine={currentLine} />
}
