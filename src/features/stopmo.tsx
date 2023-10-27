import React, { useRef, useState, useEffect } from "react";
import { atom, useRecoilState } from "recoil";

// 🎞️ Recoil Atom: Animation Frames
const framesState = atom<string[]>({
  key: "frames",
  default: [],
});

const StopMotionCreator: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [frames, setFrames] = useRecoilState(framesState);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 🎥 Initialize Webcam
  const initWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  // 📸 Capture Frame
  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      setFrames([...frames, canvas.toDataURL()]);
    }
  };

  // 🎬 Play Animation
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length);
      }, 500);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, frames]);

  return (
    <div>
      {isPlaying ? (
        <img src={frames[currentFrame]} alt="Current Frame" />
      ) : (
        <video ref={videoRef} autoPlay></video>
      )}
      <button onClick={initWebcam}>Initialize Webcam</button>
      <button onClick={captureFrame}>Capture Frame</button>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Stop" : "Play Animation"}
      </button>
    </div>
  );
};

export default StopMotionCreator;
