import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VideoState {
  videoUrl: string | null;
}

const initialState: VideoState = {
  videoUrl: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideoUrl(state, action: PayloadAction<string>) {
      state.videoUrl = action.payload;
    },
    clearVideoUrl(state) {
      state.videoUrl = null;
    },
  },
});

export const { setVideoUrl, clearVideoUrl } = videoSlice.actions;

export default videoSlice.reducer;
