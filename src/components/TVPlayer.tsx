import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TVPlayerProps {
  videoUrl: string;
  channelName: string;
  currentShow: string;
}

export default function TVPlayer({ videoUrl, channelName, currentShow }: TVPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="bg-gradient-to-br from-background to-muted/30 border border-border rounded-lg overflow-hidden mb-8">
      <div className="relative aspect-video bg-black">
        {!isPlaying ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-red-950/40 to-black/80 backdrop-blur-sm">
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
                onClick={handlePlayPause}
                className="bg-red-600 hover:bg-red-700 text-white gap-2"
              >
                <Icon name="Play" size={20} />
                Смотреть прямой эфир
              </Button>
            </div>
          </div>
        ) : (
          <>
            <iframe
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute top-4 right-4 z-10">
              <img 
                src="https://cdn.poehali.dev/files/5f25b9fc-c7a7-45be-be53-cbf3f32f5abb.jpg" 
                alt="Логотип" 
                className="h-16 w-16 rounded-lg opacity-70 shadow-lg object-cover"
              />
            </div>
          </>
        )}
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
              onChange={(e) => handleVolumeChange([Number(e.target.value)])}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
            <span className="text-sm text-muted-foreground min-w-[3ch] text-right">
              {isMuted ? 0 : volume}
            </span>
          </div>

          <Button variant="ghost" size="icon">
            <Icon name="Maximize" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
