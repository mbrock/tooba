// swa.sh - a tool, for naught
// Copyright (C) 2023  Mikael Brockman
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

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

interface IStream<T> {
  buffer: T[]
  promise: Promise<{ value?: T; done: boolean }> | null
  // methods
  resolve(arg0: { value?: T; done: boolean }): void
  reject(error: any): void
  next(): Promise<{ value?: T; done: boolean }>
  return(): Promise<{ done: true }>
  throw(error: any): void
  [Symbol.asyncIterator](): AsyncIterableIterator<T>
}

class Stream<T> implements IStream<T> {
  buffer: T[]
  promise: Promise<{ value?: T; done: boolean }> | null = null

  constructor(
    setup: (arg0: {
      next: (value: T) => void
      stop: () => void
      fail: (error: any) => void
    }) => void,
  ) {
    this.buffer = []

    const next = (value: T) => {
      if (this.promise) {
        this.resolve({ value, done: false })
        this.promise = null
      } else {
        this.buffer.push(value)
      }
    }

    const stop = () => {
      this.resolve({ done: true })
    }

    const fail = (error: any) => {
      this.reject(error)
    }

    setup({ next, stop, fail })
  }
  resolve(arg0: { value?: T; done: boolean }) {
    throw new Error("Method not implemented.")
  }
  reject(error: any) {
    throw new Error("Method not implemented.")
  }

  async next() {
    if (this.buffer.length > 0) {
      return Promise.resolve({
        value: this.buffer.shift(),
        done: false,
      })
    }

    if (!this.promise) {
      this.promise = new Promise((r, e) => {
        this.resolve = r
        this.reject = e
      })
    }

    return this.promise
  }

  return() {
    this.resolve({ done: true })
    return Promise.resolve({ done: true })
  }

  throw(error: any) {
    this.reject(error)
  }

  [Symbol.asyncIterator]() {
    return this
  }

  static async *merge(iterators: any[]) {
    const promises = iterators.map(
      (iterator: { next: () => Promise<any> }, index: any) =>
        iterator.next().then((result: any) => ({ ...result, source: index })),
    )

    while (promises.length > 0) {
      const nextPromise = Promise.race(promises)
      const { value, done, source } = await nextPromise

      if (done) {
        const index = promises.findIndex((_: any, i: any) => i === source)
        if (index !== -1) {
          promises.splice(index, 1)
        }
      } else {
        yield value
        promises[source] = iterators[source]
          .next()
          .then((result: any) => ({ ...result, source }))
      }
    }
  }
}

class BaseComponent extends HTMLElement {
  constructor(templateContent: any) {
    super()
    this.attachShadow({ mode: "open" })
    this.appendTemplate(templateContent)
  }

  $(selector: string) {
    return this.shadowRoot.querySelector(selector)
  }

  $$(selector: any) {
    return this.shadowRoot.querySelectorAll(selector)
  }

  appendTemplate(templateContent: string) {
    const template = document.createElement("template")
    template.innerHTML = templateContent
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  tag(tagName: string, attributes = {}, children = []) {
    const element = document.createElement(tagName)
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key])
    })
    children.forEach((child) => {
      if (typeof child === "string") {
        child = document.createTextNode(child)
      } else if (child instanceof HTMLElement) {
        // do nothing
      } else {
        throw new Error("Invalid child type")
      }
      element.appendChild(child)
    })
    return element
  }
}

function speechRecognitionEventStream({ language = "en-US" }) {
  return new Stream(({ next, fail }) => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)()
    recognition.interimResults = true
    recognition.continuous = true
    recognition.lang = language

    recognition.onresult = (event: {
      results: Iterable<unknown> | ArrayLike<unknown>
      resultIndex: number | undefined
    }) => {
      const timestamp = new Date().toISOString()
      next({ type: "Result", timestamp })
      Array.from(event.results)
        .slice(event.resultIndex)
        .forEach((result) => {
          next({
            type: result.isFinal ? "FinalTranscript" : "InterimTranscript",
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
      if (error.error === "no-speech") {
        next({ type: "NoSpeech", timestamp: new Date().toISOString() })
      } else if (error.error === "network") {
        next({ type: "NetworkDown" })
      } else {
        fail(error)
      }
    }

    recognition.onend = () => {
      recognition.start()
    }

    recognition.start()
  })
}

class AudioRecorder {
  mediaRecorder: MediaRecorder | null
  chunks: any[]
  stream: MediaStream | null
  startTime: number | null
  constructor() {
    this.mediaRecorder = null
    this.chunks = []
    this.stream = null
    this.startTime = null
  }

  async setup() {
    if (!this.stream) {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(this.stream)

      this.mediaRecorder.ondataavailable = (e: { data: any }) => {
        this.chunks.push(e.data)
      }
    }
  }

  async start() {
    await this.setup()

    if (this.mediaRecorder === null) {
      throw new Error("mediaRecorder is null")
    }

    if (this.mediaRecorder.state === "inactive") {
      this.mediaRecorder.start(100)
      this.startTime = Date.now()
    }
  }

  dump() {
    const blob = new Blob(this.chunks, { type: "audio/webm; codecs=opus" })
    return blob
  }

  stop() {
    return new Promise((resolve) => {
      if (this.mediaRecorder === null) {
        throw new Error("mediaRecorder is null")
      }

      this.mediaRecorder.onstop = () => {
        const blob = this.dump()
        this.chunks = []
        resolve(blob)
      }

      this.mediaRecorder.stop()
    })
  }

  async restart() {
    console.info("restarting audio")
    const blob = await this.stop()
    await this.start()
    return blob
  }
}

async function transcribe({
  file,
  token,
  language,
  prompt,
}: {
  file: Blob
  token: string
  language?: string
  prompt?: string
}) {
  const formData = new FormData()
  formData.append("file", file, "audio.webm")
  formData.append("model", "whisper-1")
  formData.append("response_format", "verbose_json")
  formData.append("prompt", prompt)
  formData.append("language", language)

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    console.error(await response.text())
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return await response.json()
}

async function demand({ key, message }: { key: string; message: string }) {
  return new Promise((resolve) => {
    const x = localStorage.getItem(key) || prompt(message)
    if (!x) {
      throw new Error("No value provided")
    }
    localStorage.setItem(key, x)
    resolve(x)
  })
}

class ResettableTimer {
  timeoutDuration: number
  onTimeout: () => Promise<void>
  timeoutId: any
  constructor(timeoutDuration: number, onTimeout: () => Promise<void>) {
    this.timeoutDuration = timeoutDuration
    this.onTimeout = onTimeout
    this.timeoutId = null
  }

  start() {
    this.reset()
  }

  reset() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
    }
    this.timeoutId = setTimeout(this.onTimeout, this.timeoutDuration)
  }

  stop() {
    clearTimeout(this.timeoutId)
    this.timeoutId = null
  }
}

class SwashDictaphone extends BaseComponent {
  db: string | null = null
  shortLanguage: string | null = null
  recognitionEventStream: Stream<any> | null = null
  recorder: AudioRecorder | null = null
  timer: ResettableTimer | null = null
  constructor() {
    super(`
      <link rel="stylesheet" href="index.css">
      <article>
        <div class="final"><p></p></div>
        <div class="interim"></div>
      </article>
      <audio controls></audio>
    `)
  }

  async connectedCallback() {
    this.db = this.getAttribute("db")
    this.loadAndHandleEvents()

    const language = this.getAttribute("lang") || "en-US"
    this.shortLanguage = language.split("-")[0]

    this.recognitionEventStream = speechRecognitionEventStream({
      language,
    })

    this.recorder = new AudioRecorder()
    await this.recorder.start()

    this.timer = new ResettableTimer(5000, async () => {
      const blob = await this.recorder.restart()
      if (!this.$(".final p:empty:last-child")) {
        this.$(".final").appendChild(this.tag("p"))
      }
      this.timer.reset()
    })

    for await (const event of this.recognitionEventStream) {
      console.log("ok", event)
      this.handleEvent(event, true)
    }
  }

  loadAndHandleEvents() {
    const events = JSON.parse(localStorage.getItem(this.db) || "[]")
    events.forEach((event: any) => this.handleEvent(event, false))
  }

  saveEvent(event: any) {
    let events = JSON.parse(localStorage.getItem(this.db) || "[]")
    events = [...events, event]
    localStorage.setItem(this.db, JSON.stringify(events))
  }

  reset() {
    localStorage.removeItem(this.db)
    this.$(".final").innerHTML = ""
    this.$(".interim").textContent = ""
  }

  async handleEvent(event: { type: string | number }, shouldSave: boolean) {
    if (shouldSave) {
      this.saveEvent(event)
    }

    const eventTypeHandlers = {
      Result: async () => {
        this.$(".interim").textContent = ""
      },

      FinalTranscript: async (event: {
        transcript: string
        grade: any
        id: any
        timestamp: any
      }) => {
        const commandFunc = {
          "reset bro": () => this.reset(),
        }[event.transcript.trim().toLowerCase()]

        if (commandFunc) {
          await commandFunc()
        } else {
          let recording = this.tag(
            "span",
            {
              "data-grade": event.grade,
              "data-id": event.id,
              "data-timestamp": event.timestamp,
              class: shouldSave ? "recording" : "",
            },
            [event.transcript],
          )

          this.$(".final p:last-of-type").appendChild(recording)

          if (shouldSave) {
            const p = this.$(".final p:last-of-type")
            const target = this.tag("span", {
              class: "whisper transcription pending",
            })

            p.appendChild(target)

            const transcription = await transcribe({
              file: this.recorder.dump(),
              token: await demand({
                key: "openai-token",
                message: "Please enter your OpenAI API token",
              }),
              language: this.shortLanguage,
            })

            target.classList.remove("pending")
            target.classList.add("done")

            // remove all other transcriptions in the same paragraph
            for (const span of p.querySelectorAll(".whisper.transcription")) {
              if (span !== target) {
                span.remove()
              }
            }

            recording.remove()

            // {"task":"transcribe","language":"english","duration":2.94,"segments":[{"id":0,"seek":0,"start":0.0,"end":3.0,"text":" Hello.","tokens":[50364,2425,13,50514],"temperature":0.0,"avg_logprob":-0.936490821838379,"compression_ratio":0.42857142857142855,"no_speech_prob":0.2167164534330368,"transient":false}],"text":"Hello."}

            console.info(transcription)

            target.textContent = transcription.text
          }

          this.$(".interim").textContent = ""
        }
      },

      InterimTranscript: async (event: { transcript: any }) => {
        this.$(".interim").textContent += event.transcript

        if (shouldSave) {
          this.timer.reset()
        }
      },

      NoSpeech: async (event: any) => {
        if (shouldSave) {
        }
      },
    }

    const handlerFunc = eventTypeHandlers[event.type]
    if (handlerFunc) {
      await handlerFunc(event)
    }

    // scroll to bottom smoothly, centering the last line
    this.$(".final > :last-child, .interim").scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }
}

// Define the new element
customElements.define("swash-dictaphone", SwashDictaphone)

function confidenceGrade(confidence: number) {
  let grade
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
  } else {
    grade = "F"
  }
  return grade
}
