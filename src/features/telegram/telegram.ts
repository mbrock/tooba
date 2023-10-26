import { openDB } from "https://cdn.jsdelivr.net/npm/idb@7/+esm"

const TELEGRAM_API_URL = "https://api.telegram.org/bot"
const TELEGRAM_FILE_API_URL = "https://api.telegram.org/file/bot"
const CORS_PROXY_URL = "https://telegram-cors-proxy.herokuapp.com"

export function telegramUpdateIterator(botToken, loadFromDB = true) {
  let db

  const initDB = async () => {
    db = await openDB("telegram", 1, {
      upgrade(db) {
        db.createObjectStore("telegram", {
          keyPath: ["botToken", "update_id"],
        })
      },
    })
  }

  const getLastUpdateId = async () => {
    const telegramStore = db.transaction("telegram").objectStore("telegram")
    const range = IDBKeyRange.bound([botToken], [botToken, ""])
    const cursor = await telegramStore.openCursor(range, "prev")
    return cursor ? cursor.value.update_id : "0"
  }

  const storeUpdates = async (updates) => {
    const transaction = db.transaction("telegram", "readwrite")
    const telegramStore = transaction.objectStore("telegram")

    for (const update of updates) {
      await telegramStore.put({ ...update, botToken })
    }
  }

  const getAndStoreUpdates = async () => {
    const lastUpdateId = await getLastUpdateId()
    const updates = await fetchFromTelegramAPI(botToken, "getUpdates", {
      offset: Number(lastUpdateId) + 1,
      timeout: 60,
    })

    if (!updates.ok) {
      throw new Error("telegram API error")
    }

    if (updates.result.length > 0) {
      await storeUpdates(updates.result)
    }

    return updates.result
  }

  const iterator = {
    [Symbol.asyncIterator]: async function* () {
      await initDB()

      if (loadFromDB) {
        const transaction = db.transaction("telegram")
        const store = transaction.objectStore("telegram")
        let cursor = await store.openCursor()
        const updates = []

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

async function fetchFromTelegramAPI(botToken, method, params) {
  const queryParams = new URLSearchParams(params).toString()
  const apiUrl = `${TELEGRAM_API_URL}${botToken}/${method}?${queryParams}`
  return await fetchJson(apiUrl)
}

async function fetchJson(path) {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export async function downloadTelegramFile(botToken, file_id) {
  const {
    ok,
    result: { file_path },
  } = await fetchFromTelegramAPI(botToken, "getFile", {
    file_id,
  })

  if (!ok) {
    throw new Error("telegram API error")
  }

  const response = await fetch(
    `${CORS_PROXY_URL}/${TELEGRAM_FILE_API_URL}${botToken}/${file_path}`,
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  } else {
    return response.blob()
  }
}
