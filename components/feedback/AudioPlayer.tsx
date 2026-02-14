"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  duration?: number;
  className?: string;
}

export function AudioPlayer({ audioUrl, duration, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const togglePlaybackRate = () => {
    const rates = [1.0, 1.25, 1.5, 1.75, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    const newRate = rates[nextIndex];
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * (audioRef.current.duration || 0);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleLoadedMetadata = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load audio");
    console.error("Failed to load audio from:", audioUrl);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const totalTime = audioRef.current?.duration || duration || 0;

  return (
    <Card className={cn("bg-[#F5F3FF] border border-violet-100 rounded-xl shadow-sm", className)}>
      <CardContent className="p-4 bg-white rounded-lg space-y-4">
        {/* Top row: Time indicator and menu */}
        <div className="flex justify-between items-center">
          <div className="bg-violet-500 rounded-full px-3 py-1">
            <span className="text-white text-sm font-mono">{formatTime(currentTime)}</span>
          </div>
          <button className="p-1 rounded hover:bg-gray-100">
            <div className="flex flex-col space-y-1">
              {/* <div className="w-1 h-1 bg-violet-400 rounded-full"></div>
              <div className="w-1 h-1 bg-violet-400 rounded-full"></div>
              <div className="w-1 h-1 bg-violet-400 rounded-full"></div> */}
            </div>
          </button>
        </div>

        {/* Waveform visualization */}
        <div className="h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
          <div className="flex items-end space-x-px h-12 w-full px-4">
            {Array.from({ length: 60 }).map((_, i) => (
              <div 
                key={i}
                className="bg-gray-300 flex-grow rounded-t"
                style={
                  i === Math.floor((currentTime / totalTime) * 60) 
                    ? { height: '80%', backgroundColor: '#7c3aed' }
                    : { height: `${Math.random() * 60 + 20}%` }
                }
              />
            ))}
          </div>
        </div>

        {/* Bottom row: Controls and duration */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlayback}
              disabled={isLoading || !!error}
              className="w-8 h-8 bg-violet-500 rounded flex items-center justify-center hover:bg-violet-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <div className="w-3 h-3 bg-white" />
              ) : (
                <div className="w-0 h-0 border-l-4 border-l-white border-y-3 border-y-transparent ml-0.5" />
              )}
            </button>
            
            <button
              onClick={togglePlaybackRate}
              className="text-gray-600 text-sm hover:text-gray-900 font-mono"
            >
              {playbackRate.toFixed(1)}x
            </button>
            
            <div className="flex space-x-1">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3L3 8L8 13V3Z" />
                </svg>
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3L13 8L8 13V3Z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="text-gray-500 text-sm font-mono">
            {formatTime(currentTime)} / {formatTime(totalTime)}
          </div>
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onError={handleError}
        />
        
        {isLoading && (
          <p className="text-center text-sm text-gray-500">
            Loading audio...
          </p>
        )}
        
        {error && (
          <div className="text-center text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
            {error}. Please try refreshing the page.
          </div>
        )}
      </CardContent>
    </Card>
  );
}