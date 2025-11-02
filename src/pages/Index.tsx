import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AudioPlayer from '@/components/AudioPlayer';
import RadioPlayer from '@/components/RadioPlayer';
import VideoPlaylist from '@/components/VideoPlaylist';
import Icon from '@/components/ui/icon';

type Section = 'Главная' | 'Интервью' | 'Новости' | 'Рецензии' | 'Афиша' | 'Видео' | 'Радио' | 'ТВ' | 'О редакции';

interface Article {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  date: string;
  featured?: boolean;
  hasAudio?: boolean;
  audioTitle?: string;
  audioArtist?: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Пан Пантер: "Гравитация" — это про притяжение двух миров',
    category: 'Интервью',
    image: 'https://cdn.poehali.dev/files/5f25b9fc-c7a7-45be-be53-cbf3f32f5abb.jpg',
    excerpt: 'Эксклюзивное интервью с артистом о новом треке совместно с Катей Денисовой и планах на будущее',
    date: '26 октября 2025',
    featured: true,
    hasAudio: true,
    audioTitle: 'Гравитация',
    audioArtist: 'Пан Пантер feat. Катя Денисова'
  },
  {
    id: 2,
    title: 'Винил возвращается: почему аналоговый звук снова в моде',
    category: 'Новости',
    image: 'https://cdn.poehali.dev/projects/5ece38b0-b2be-4b0c-8835-fe706b8ba4ca/files/3fa09796-aaa1-4ab0-86dd-47a02d19e7ec.jpg',
    excerpt: 'Продажи виниловых пластинок достигли максимума за последние 30 лет',
    date: '25 октября 2025'
  },
  {
    id: 3,
    title: 'Фестивальный сезон 2025: главные события года',
    category: 'Афиша',
    image: 'https://cdn.poehali.dev/projects/5ece38b0-b2be-4b0c-8835-fe706b8ba4ca/files/f9654b84-9df6-47d0-a27b-0128495e0e6d.jpg',
    excerpt: 'Обзор самых ожидаемых музыкальных фестивалей этого лета',
    date: '24 октября 2025'
  },
  {
    id: 4,
    title: 'Электронная сцена: топ-10 треков октября',
    category: 'Рецензии',
    image: 'https://cdn.poehali.dev/projects/5ece38b0-b2be-4b0c-8835-fe706b8ba4ca/files/3fa09796-aaa1-4ab0-86dd-47a02d19e7ec.jpg',
    excerpt: 'Лучшие релизы электронной музыки за последний месяц',
    date: '23 октября 2025',
    hasAudio: true,
    audioTitle: 'Плейлист октября',
    audioArtist: 'Various Artists'
  },
  {
    id: 5,
    title: 'За кулисами: как создается современный альбом',
    category: 'Интервью',
    image: 'https://cdn.poehali.dev/projects/5ece38b0-b2be-4b0c-8835-fe706b8ba4ca/files/abaa46a2-05aa-4227-8540-64f6bbb2888b.jpg',
    excerpt: 'Продюсеры рассказывают о процессе создания музыки в 2025 году',
    date: '22 октября 2025'
  },
  {
    id: 6,
    title: 'Концертная индустрия после пандемии: новые тренды',
    category: 'Новости',
    image: 'https://cdn.poehali.dev/projects/5ece38b0-b2be-4b0c-8835-fe706b8ba4ca/files/f9654b84-9df6-47d0-a27b-0128495e0e6d.jpg',
    excerpt: 'Как изменился живой музыкальный опыт и что ждет индустрию',
    date: '21 октября 2025'
  }
];

export default function Index() {
  const [activeSection, setActiveSection] = useState<Section>('Главная');

  const sections: Section[] = ['Главная', 'Радио', 'ТВ', 'Интервью', 'Новости', 'Рецензии', 'Афиша', 'Видео', 'О редакции'];

  const featuredArticle = articles.find(a => a.featured);
  const otherArticles = articles.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight">
              КонтентМедиа<span className="text-red-600">PRO</span>
            </h1>
            <Button variant="ghost" size="icon">
              <Icon name="Menu" size={24} />
            </Button>
          </div>
          
          <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sections.map((section) => (
              <Button
                key={section}
                variant={activeSection === section ? 'default' : 'ghost'}
                onClick={() => setActiveSection(section)}
                className="font-heading text-sm whitespace-nowrap"
              >
                {section}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'ТВ' ? (
          <section className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  Музыкальное ТВ КонтентМедиа<span className="text-red-600">PRO</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Лучшие музыкальные клипы с автоплеем
                </p>
              </div>

              <VideoPlaylist channelName="КонтентМедиаPRO TV" />
            </div>
          </section>
        ) : activeSection === 'Радио' ? (
          <section className="animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  Интернет-радио КонтентМедиа<span className="text-red-600">PRO</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Лучшая музыка 24/7 в прямом эфире
                </p>
              </div>

              <RadioPlayer
                streamUrl="https://myradio24.org/54137"
                stationName="КонтентМедиаPRO FM"
                currentShow="Вечерний драйв"
              />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 border border-border rounded-lg p-6">
                  <h4 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Calendar" size={20} />
                    Расписание эфиров
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Утренний бриз</p>
                        <p className="text-sm text-muted-foreground">06:00 - 10:00</p>
                      </div>
                      <Badge variant="outline">Лёгкая музыка</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Дневной микс</p>
                        <p className="text-sm text-muted-foreground">10:00 - 14:00</p>
                      </div>
                      <Badge variant="outline">Хиты</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Послеобеденный релакс</p>
                        <p className="text-sm text-muted-foreground">14:00 - 18:00</p>
                      </div>
                      <Badge variant="outline">Чилаут</Badge>
                    </div>
                    <div className="flex justify-between items-center bg-accent/20 -mx-3 px-3 py-2 rounded">
                      <div>
                        <p className="font-semibold">Вечерний драйв</p>
                        <p className="text-sm text-muted-foreground">18:00 - 22:00</p>
                      </div>
                      <Badge className="bg-red-600 text-white">В эфире</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Ночной вайб</p>
                        <p className="text-sm text-muted-foreground">22:00 - 02:00</p>
                      </div>
                      <Badge variant="outline">Электроника</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Ночной джаз</p>
                        <p className="text-sm text-muted-foreground">02:00 - 06:00</p>
                      </div>
                      <Badge variant="outline">Джаз</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 border border-border rounded-lg p-6">
                  <h4 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Music" size={20} />
                    Популярные треки
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center text-white font-bold">1</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Гравитация</p>
                        <p className="text-xs text-muted-foreground">Пан Пантер feat. Катя Денисова</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="Play" size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded bg-gradient-to-br from-gray-600 to-gray-400 flex items-center justify-center text-white font-bold">2</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Летний вечер</p>
                        <p className="text-xs text-muted-foreground">Artik & Asti</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="Play" size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center text-white font-bold">3</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Между нами</p>
                        <p className="text-xs text-muted-foreground">Miyagi & Andy Panda</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="Play" size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-muted-foreground font-bold">4</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Танцы на стёклах</p>
                        <p className="text-xs text-muted-foreground">Скриптонит</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="Play" size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-muted-foreground font-bold">5</div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">Мало так мало</p>
                        <p className="text-xs text-muted-foreground">Zivert</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon name="Play" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : activeSection === 'Главная' && featuredArticle ? (
          <section className="mb-12 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative overflow-hidden rounded-lg aspect-[4/3] group">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  {featuredArticle.category}
                </Badge>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
                  {featuredArticle.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {featuredArticle.excerpt}
                </p>
                <p className="text-sm text-muted-foreground">
                  {featuredArticle.date}
                </p>
                
                {featuredArticle.hasAudio && (
                  <AudioPlayer
                    title={featuredArticle.audioTitle || ''}
                    artist={featuredArticle.audioArtist || ''}
                  />
                )}

                <Button className="mt-4">
                  Читать далее
                  <Icon name="ArrowRight" size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        {activeSection === 'Главная' && (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherArticles.map((article, index) => (
            <article
              key={article.id}
              className="group animate-fade-in space-y-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden rounded-lg aspect-[4/3]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-background/90 text-foreground">
                  {article.category}
                </Badge>
                {article.hasAudio && (
                  <div className="absolute bottom-4 right-4 bg-accent text-accent-foreground rounded-full p-2">
                    <Icon name="Headphones" size={16} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-heading font-semibold leading-tight group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {article.excerpt}
                </p>
                <p className="text-xs text-muted-foreground">
                  {article.date}
                </p>
              </div>

              {article.hasAudio && (
                <AudioPlayer
                  title={article.audioTitle || ''}
                  artist={article.audioArtist || ''}
                />
              )}
            </article>
          ))}
        </section>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">КонтентМедиа<span className="text-red-600">PRO</span></h4>
              <p className="text-sm text-muted-foreground">
                Музыкальное издание о современной культуре, артистах и трендах
              </p>
            </div>
            
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Разделы</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {sections.map(section => (
                  <li key={section}>
                    <button className="hover:text-foreground transition-colors">
                      {section}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Соцсети</h4>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon">
                  <Icon name="Instagram" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Twitter" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Youtube" size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2025 КонтентМедиаPRO. Все права защищены
          </div>
        </div>
      </footer>
    </div>
  );
}