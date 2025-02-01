import { useState, useEffect } from "react";
import { UseMediaStreamResult } from "./use-media-stream-mux";

export function useWebcam(): UseMediaStreamResult & { switchCamera: () => Promise<void> } {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    const handleStreamEnded = () => {
      setIsStreaming(false);
      setStream(null);
    };
    if (stream) {
      stream.getTracks().forEach((track) => 
        track.addEventListener("ended", handleStreamEnded)
      );
      return () => {
        stream.getTracks().forEach((track) =>
          track.removeEventListener("ended", handleStreamEnded)
        );
      };
    }
  }, [stream]);

  const getStream = async (facingMode: 'user' | 'environment') => {
    const constraints = {
      video: {
        facingMode: facingMode,
      }
    };
    return await navigator.mediaDevices.getUserMedia(constraints);
  };

  const start = async () => {
    const mediaStream = await getStream(facingMode);
    setStream(mediaStream);
    setIsStreaming(true);
    return mediaStream;
  };

  const stop = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  };

  const switchCamera = async () => {
    // Stop current stream
    stop();
    
    // Toggle facing mode
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    // Start new stream
    const mediaStream = await getStream(newFacingMode);
    setStream(mediaStream);
    setIsStreaming(true);
  };

  const result: UseMediaStreamResult & { switchCamera: () => Promise<void> } = {
    type: "webcam",
    start,
    stop,
    isStreaming,
    stream,
    switchCamera
  };

  return result;
}