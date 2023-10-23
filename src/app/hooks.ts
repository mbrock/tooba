import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "./store"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

import { useState, useEffect } from 'react';

export const useObjectUrl = (fileHandle: FileSystemFileHandle): string | null => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchObjectUrl = async () => {
      if (!fileHandle) return;

      const file = await fileHandle.getFile();
      const objectUrl = URL.createObjectURL(file);

      setObjectUrl(objectUrl);

      return () => {
        // Release object URL to free up resources
        URL.revokeObjectURL(objectUrl);
      };
    };

    fetchObjectUrl();
  }, [fileHandle]);

  return objectUrl;
};
