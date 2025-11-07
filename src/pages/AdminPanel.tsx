import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Interview {
  id: number;
  title: string;
  subtitle: string | null;
  content: string;
  author: string | null;
  image_url: string | null;
  category: string;
  published_date: string;
  is_published: boolean;
}

export default function AdminPanel() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin/login');
      return;
    }
    
    loadInterviews();
  }, [navigate]);

  const loadInterviews = async (searchQuery = '') => {
    setLoading(true);
    try {
      const url = searchQuery 
        ? `https://functions.poehali.dev/bd8e2b39-63fc-4e49-a4d5-8ecfa98ddc76?search=${encodeURIComponent(searchQuery)}`
        : 'https://functions.poehali.dev/bd8e2b39-63fc-4e49-a4d5-8ecfa98ddc76';
      
      const response = await fetch(url);
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error('Error loading interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadInterviews(search);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить это интервью?')) {
      return;
    }

    try {
      await fetch(`https://functions.poehali.dev/bd8e2b39-63fc-4e49-a4d5-8ecfa98ddc76?id=${id}`, {
        method: 'DELETE',
      });
      loadInterviews(search);
    } catch (error) {
      console.error('Error deleting interview:', error);
      alert('Ошибка при удалении');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Icon name="LayoutDashboard" size={32} className="text-red-600" />
            Управление интервью
          </h1>
          
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-red-600/30 text-white hover:bg-red-600/20"
            >
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-600/30 text-white hover:bg-red-600/20"
            >
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <div className="bg-black/80 backdrop-blur-sm border border-red-600/30 rounded-lg p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по названию, содержимому или автору..."
                className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500"
              />
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700"
              >
                <Icon name="Search" size={18} />
              </Button>
            </form>
            
            <Button
              onClick={() => navigate('/admin/interviews/new')}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить интервью
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">
              Загрузка...
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">
                {search ? 'Ничего не найдено' : 'Пока нет интервью'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="bg-black/50 border border-red-600/20 rounded-lg p-4 hover:border-red-600/40 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {interview.image_url && (
                      <img
                        src={interview.image_url}
                        alt={interview.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {interview.title}
                      </h3>
                      {interview.subtitle && (
                        <p className="text-gray-400 text-sm mb-2">
                          {interview.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {interview.author && (
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={14} />
                            {interview.author}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          {new Date(interview.published_date).toLocaleDateString('ru-RU')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          interview.is_published 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {interview.is_published ? 'Опубликовано' : 'Черновик'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/admin/interviews/edit/${interview.id}`)}
                        size="sm"
                        variant="outline"
                        className="border-red-600/30 text-white hover:bg-red-600/20"
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(interview.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-600/30 text-red-400 hover:bg-red-600/20"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
