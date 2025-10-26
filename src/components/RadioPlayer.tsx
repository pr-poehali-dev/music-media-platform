import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface RadioPlayerProps {
  streamUrl: string;
  stationName: string;
  currentShow: string;
}

export default function RadioPlayer({ streamUrl, stationName, currentShow }: RadioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTrack, setCurrentTrack] = useState('Загрузка...');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const updateTrackInfo = () => {
      const tracks = [
        'Пан Пантер feat. Катя Денисова - Гравитация',
        'Artik & Asti - Летний вечер',
        'Miyagi & Andy Panda - Между нами',
        'Скриптонит - Танцы на стёклах',
        'Zivert - Мало так мало'
      ];
      
      setCurrentTrack(tracks[Math.floor(Math.random() * tracks.length)]);
    };

    updateTrackInfo();
    const interval = setInterval(updateTrackInfo, 15000);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = '';
    } else {
      audioRef.current.src = streamUrl;
      audioRef.current.play().catch(err => {
        console.error('Ошибка воспроизведения:', err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-border rounded-2xl p-6">
      <audio ref={audioRef} preload="none" />
      
      <div className="flex items-center gap-4 mb-6">
        <div className={`h-20 w-20 rounded-full bg-red-600 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
          <Icon name="Radio" size={40} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Сейчас в эфире</p>
          <h3 className="text-2xl font-heading font-bold mb-1">{currentShow}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{currentTrack}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={togglePlay}
            size="lg"
            className={`h-14 px-8 ${isPlaying ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} className="mr-2" />
            {isPlaying ? 'Остановить' : 'Слушать эфир'}
          </Button>

          <div className="flex-1 flex items-center gap-3">
            <Icon name="Volume2" size={20} className="text-muted-foreground" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent"
            />
            <span className="text-sm text-muted-foreground w-12">{volume}%</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isPlaying ? 'bg-red-600 animate-pulse' : 'bg-muted'}`} />
            <span>{isPlaying ? 'Прямой эфир' : 'Не в эфире'}</span>
          </div>
          <span>•</span>
          <span>2,347 слушателей</span>
          <span>•</span>
          <span>128 kbps</span>
        </div>
      </div>
    </div>
  );
}
