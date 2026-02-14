"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Play, Pause, Square, Volume2, Clock } from "lucide-react";
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
  };

  const handleError = () => {
    setIsLoading(false);
    console.error("Failed to load audio");
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
    <Card className={cn("border-violet-100/50 shadow-purple-sm rounded-2xl", className)}>
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-violet-600" />
          {audioUrl.includes('soundjay') ? 'Demo Audio' : 'Session Recording'}
          {audioUrl.includes('soundjay') && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              TEST MODE
            </span>
          )}
        </CardTitle>
        <p className="text-sm text-violet-700/60">
          {audioUrl.includes('soundjay') 
            ? 'This is a demo audio file. Complete a real interview to record your actual session.'
            : 'Listen to your complete interview session'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
        />
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-violet-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalTime)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={totalTime ? (currentTime / totalTime) * 100 : 0}
            onChange={handleSeek}
            className="w-full h-2 bg-violet-100 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-600"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={stopPlayback}
            disabled={isLoading}
            className="border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl"
          >
            <Square className="w-4 h-4" />
          </Button>
          
          <Button
            size="icon"
            onClick={togglePlayback}
            disabled={isLoading}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl w-12 h-12"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-1" />
            )}
          </Button>
          
          {duration && (
            <Badge variant="secondary" className="bg-violet-50 text-violet-700 border-violet-200">
              <Clock className="w-3 h-3 mr-1" />
              {Math.ceil(duration / 60)} min
            </Badge>
          )}
        </div>

        {isLoading && (
          <p className="text-center text-sm text-violet-500">
            Loading audio...
          </p>
        )}
      </CardContent>
    </Card>
  );
}