import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Video {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  rutubeUrl: string;
}

const musicVideos: Video[] = [
  {
    id: '1',
    title: 'Гравитация',
    artist: 'Пан Пантер feat. Катя Денисова',
    thumbnail: 'https://cdn.poehali.dev/files/5f25b9fc-c7a7-45be-be53-cbf3f32f5abb.jpg',
    rutubeUrl: 'https://rutube.ru/play/embed/c6cc4d620b1d4338901c71f60c86fbb6'
  },
  {
    id: '2',
    title: 'Музыкальный клип 1',
    artist: 'Артист 1',
    thumbnail: 'https://cdn.poehali.dev/projects/5ece38b0-b2be-4b0c-8835-fe706b8ba4ca/files/3fa09796-aaa1-4ab0-86dd-47a02d19e7ec.jpg',
    rutubeUrl: 'https://rutube.ru/play/embed/c6cc4d620b1d4338901c71f60c86fbb6'
  },
  {
    id: '3',
    title: 'Музыкальный клип 2',
    artist: 'Артист 2',
    thumbnail: 'https://cdn.poehali.dev/projects/5ece38b0-b2be-4b0c-8835-fe706b8ba4ca/files/f9654b84-9df6-47d0-a27b-0128495e0e6d.jpg',
    rutubeUrl: 'https://rutube.ru/play/embed/c6cc4d620b1d4338901c71f60c86fbb6'
  },
  {
    id: '4',
    title: 'Музыкальный клип 3',
    artist: 'Артист 3',
    thumbnail: 'https://cdn.poehali.dev/projects/5ece38b0-b2be-4b0c-8835-fe706b8ba4ca/files/abaa46a2-05aa-4227-8540-64f6bbb2888b.jpg',
    rutubeUrl: 'https://rutube.ru/play/embed/c6cc4d620b1d4338901c71f60c86fbb6'
  }
];

interface VideoPlaylistProps {
  channelName: string;
}

export default function VideoPlaylist({ channelName }: VideoPlaylistProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const currentVideo = musicVideos[currentVideoIndex];

  useEffect(() => {
    if (autoplay && isPlaying) {
      const timer = setTimeout(() => {
        handleNext();
      }, 180000);
      return () => clearTimeout(timer);
    }
  }, [currentVideoIndex, autoplay, isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % musicVideos.length);
  };

  const handlePrevious = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + musicVideos.length) % musicVideos.length);
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-background to-muted/30 border border-border rounded-lg overflow-hidden">
        <div className="relative aspect-video bg-black">
          {!isPlaying ? (
            <div 
              className="absolute inset-0 flex flex-col items-center justify-center bg-cover bg-center"
              style={{ backgroundImage: `url(${currentVideo.thumbnail})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 to-black/80 backdrop-blur-sm" />
              <div className="relative text-center space-y-6 z-10">
                <div className="w-24 h-24 rounded-full bg-red-600/20 flex items-center justify-center mx-auto border-4 border-red-600/30">
                  <Icon name="Play" size={48} className="text-red-600 ml-1" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">{currentVideo.title}</h3>
                  <p className="text-white/70">{currentVideo.artist}</p>
                </div>
                <Button
                  size="lg"
                  onClick={handlePlayPause}
                  className="bg-red-600 hover:bg-red-700 text-white gap-2"
                >
                  <Icon name="Play" size={20} />
                  Смотреть
                </Button>
              </div>
            </div>
          ) : (
            <>
              <iframe
                src={`${currentVideo.rutubeUrl}?autoplay=1`}
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
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-heading font-bold">{currentVideo.title}</h3>
                <Badge className="bg-red-600 text-white">
                  <Icon name="Music" size={12} className="mr-1" />
                  {currentVideoIndex + 1} / {musicVideos.length}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{currentVideo.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
            >
              <Icon name="SkipBack" size={20} />
            </Button>

            <Button
              variant={isPlaying ? 'default' : 'outline'}
              size="icon"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Icon name="Pause" size={20} /> : <Icon name="Play" size={20} />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
            >
              <Icon name="SkipForward" size={20} />
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

            <Button
              variant={autoplay ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setAutoplay(!autoplay)}
              title={autoplay ? 'Автоплей включен' : 'Автоплей выключен'}
            >
              <Icon name="Repeat" size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <h4 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
          <Icon name="List" size={20} />
          Плейлист ({musicVideos.length} клипов)
        </h4>
        <div className="space-y-2">
          {musicVideos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => handleVideoSelect(index)}
              className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors ${
                currentVideoIndex === index
                  ? 'bg-red-600/10 border border-red-600/30'
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="relative w-20 h-12 rounded overflow-hidden flex-shrink-0">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                {currentVideoIndex === index && isPlaying && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Icon name="Play" size={16} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-semibold text-sm ${currentVideoIndex === index ? 'text-red-600' : ''}`}>
                  {video.title}
                </p>
                <p className="text-xs text-muted-foreground">{video.artist}</p>
              </div>
              {currentVideoIndex === index && (
                <Badge variant="outline" className="border-red-600 text-red-600">
                  Играет
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
