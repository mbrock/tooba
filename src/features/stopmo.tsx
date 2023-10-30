import React, { useRef, useState, useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { TileGroup, Tile } from './mosaic/Mosaic';

// 🎞️ Recoil Atom: Animation Frames
const framesState = atom<string[]>({
  key: 'frames',
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
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
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
    <>
      <TileGroup>
        {isPlaying ? (
          <img src={frames[currentFrame]} alt="Current Frame" className="dark:border-blue-700 border-yellow-500 border-4" />
        ) : (
          <video ref={videoRef} autoPlay className="dark:border-blue-700 border-yellow-500 border-4"></video>
        )}
        <Tile onClick={initWebcam}>
          Initialize Webcam
        </Tile>
        <Tile onClick={captureFrame}>
          Capture Frame
        </Tile>
        <Tile onClick={() => setIsPlaying((prev) => !prev)}>
          {isPlaying ? 'Stop' : 'Play Animation'}
        </Tile>
      </TileGroup>
      <TileGroup>
        {frames.map((frame, index) => (
          <Tile key={index} onClick={() => setCurrentFrame(index)}>
            <img src={frame} alt={`Frame ${index}`} className="w-20 h-20 object-cover" />
          </Tile>
        ))}
      </TileGroup>
    </>
  );
};

export default StopMotionCreator;
