import { openDB, IDBPDatabase } from "idb"

const TELEGRAM_API_URL = "https://api.telegram.org/bot"
const TELEGRAM_FILE_API_URL = "https://api.telegram.org/file/bot"
const CORS_PROXY_URL = "https://telegram-cors-proxy.herokuapp.com"

interface Update {
  update_id: string
  [key: string]: any
}

interface FetchResult<T> {
  ok: boolean
  result: T
}

export function telegramUpdateIterator(botToken: string, loadFromDB = true) {
  let db: IDBPDatabase

  const initDB = async () => {
    db = await openDB("telegram", 1, {
      upgrade(db) {
        db.createObjectStore("telegram", {
          keyPath: ["botToken", "update_id"],
        })
      },
    })
  }

  const getLastUpdateId = async (): Promise<string> => {
    const telegramStore = db.transaction("telegram").objectStore("telegram")
    const range = IDBKeyRange.bound([botToken], [botToken, ""])
    const cursor = await telegramStore.openCursor(range, "prev")
    return cursor ? cursor.value.update_id : "0"
  }

  const storeUpdates = async (updates: Update[]) => {
    const transaction = db.transaction("telegram", "readwrite")
    const telegramStore = transaction.objectStore("telegram")

    for (const update of updates) {
      await telegramStore.put({ ...update, botToken })
    }
  }

  const getAndStoreUpdates = async () => {
    const lastUpdateId = await getLastUpdateId()
    const updates = await fetchFromTelegramAPI<Update[]>(
      botToken,
      "getUpdates",
      {
        offset: Number(lastUpdateId) + 1,
        timeout: 60,
      },
    )

    if (updates.length > 0) {
      await storeUpdates(updates)
    }

    return updates
  }

  const iterator = {
    [Symbol.asyncIterator]: async function* () {
      await initDB()

      if (loadFromDB) {
        const transaction = db.transaction("telegram")
        const store = transaction.objectStore("telegram")
        let cursor = await store.openCursor()
        const updates: Update[] = []

        while (cursor) {
          if (cursor.value.botToken === botToken) {
            updates.push(cursor.value)
          }
          cursor = await cursor.continue()
        }

        for await (let update of updates) {
          yield update
        }
      }

      while (true) {
        const updates = await getAndStoreUpdates()
        if (updates && updates.length > 0) {
          yield* updates
        }
      }
    },
  }

  return iterator
}

async function fetchFromTelegramAPI<T>(
  botToken: string,
  method: string,
  params: any,
): Promise<T> {
  const queryParams = new URLSearchParams(params).toString()
  const apiUrl = `${TELEGRAM_API_URL}${botToken}/${method}?${queryParams}`
  const { ok, result } = await fetchJson<FetchResult<T>>(apiUrl)
  if (!ok) {
    throw new Error("telegram API error")
  } else {
    return result
  }
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function downloadTelegramFile(
  botToken: string,
  file_id: string,
): Promise<Blob> {
  const { file_path } = await fetchFromTelegramAPI<{ file_path: string }>(
    botToken,
    "getFile",
    { file_id },
  )

  const response = await fetch(
    `${CORS_PROXY_URL}/${TELEGRAM_FILE_API_URL}${botToken}/${file_path}`,
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    return response.blob()
  }
}
