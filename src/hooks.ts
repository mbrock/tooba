import { useState, useEffect } from "react"

export const useObjectUrl = (
  fileHandle: FileSystemFileHandle,
): string | null => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchObjectUrl = async () => {
      if (!fileHandle) return

      const file = await fileHandle.getFile()
      const objectUrl = URL.createObjectURL(file)

      setObjectUrl(objectUrl)

      return () => {
        // Release object URL to free up resources
        URL.revokeObjectURL(objectUrl)
      }
    }

    fetchObjectUrl()
  }, [fileHandle])

  return objectUrl
}

export const useFileHandleContent = (
  fileHandle: FileSystemFileHandle,
): string | null => {
  const [content, setContent] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      if (!fileHandle) return

      const file = await fileHandle.getFile()
      const content = await file.text()

      setContent(content)
    }

    fetchContent()
  }, [fileHandle])

  return content
}
