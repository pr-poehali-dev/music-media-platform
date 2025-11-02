import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import Hls from 'hls.js';

interface HLSTVPlayerProps {
  streamUrl: string;
  channelName: string;
  currentShow: string;
}

export default function HLSTVPlayer({ streamUrl, channelName, currentShow }: HLSTVPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS stream ready');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
      });

      hlsRef.current = hls;

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    }
  }, [streamUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume / 100;
    video.muted = isMuted;
  }, [volume, isMuted]);

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Play error:', error);
      }
    }
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="bg-gradient-to-br from-background to-muted/30 border border-border rounded-lg overflow-hidden mb-8"
    >
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="w-full h-full"
          playsInline
          onClick={handlePlayPause}
        />

        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-950/40 to-black/80 backdrop-blur-sm cursor-pointer" onClick={handlePlayPause}>
            <div className="text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-red-600/20 flex items-center justify-center mx-auto border-4 border-red-600/30">
                <Icon name="Tv" size={48} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-2">{channelName}</h3>
                <p className="text-white/70">{currentShow}</p>
              </div>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white gap-2"
              >
                <Icon name="Play" size={20} />
                Смотреть прямой эфир
              </Button>
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          <img 
            src="https://cdn.poehali.dev/files/5f25b9fc-c7a7-45be-be53-cbf3f32f5abb.jpg" 
            alt="Логотип" 
            className="h-16 w-16 rounded-lg opacity-70 shadow-lg object-cover"
          />
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-heading font-bold">{channelName}</h3>
              <Badge className="bg-red-600 text-white">
                <span className="w-2 h-2 bg-white rounded-full inline-block mr-1 animate-pulse" />
                LIVE
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{currentShow}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant={isPlaying ? 'default' : 'outline'}
            size="icon"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Icon name="Pause" size={20} /> : <Icon name="Play" size={20} />}
          </Button>

          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
            >
              {isMuted || volume === 0 ? (
                <Icon name="VolumeX" size={20} />
              ) : volume < 50 ? (
                <Icon name="Volume1" size={20} />
              ) : (
                <Icon name="Volume2" size={20} />
              )}
            </Button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <span className="text-sm text-muted-foreground min-w-[3ch] text-right">
              {isMuted ? 0 : volume}
            </span>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Icon name="Minimize" size={20} /> : <Icon name="Maximize" size={20} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
