import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface InterviewFormData {
  title: string;
  subtitle: string;
  content: string;
  author: string;
  image_url: string;
  category: string;
  is_published: boolean;
}

export default function AdminInterviewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = !!id;

  const [formData, setFormData] = useState<InterviewFormData>({
    title: '',
    subtitle: '',
    content: '',
    author: '',
    image_url: '',
    category: 'interview',
    is_published: true,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin/login');
      return;
    }

    if (isEdit && id) {
      loadInterview(id);
    }
  }, [navigate, isEdit, id]);

  const loadInterview = async (interviewId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/bd8e2b39-63fc-4e49-a4d5-8ecfa98ddc76?id=${interviewId}`
      );
      const data = await response.json();
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || '',
        content: data.content || '',
        author: data.author || '',
        image_url: data.image_url || '',
        category: data.category || 'interview',
        is_published: data.is_published ?? true,
      });
      if (data.image_url) {
        setImagePreview(data.image_url);
      }
    } catch (error) {
      console.error('Error loading interview:', error);
      alert('Ошибка при загрузке интервью');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5 МБ');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setImagePreview(base64);

        try {
          const response = await fetch('https://functions.poehali.dev/fafb7936-42fc-4dc9-8f91-5a610be72d55', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64,
              filename: file.name,
            }),
          });

          const data = await response.json();
          
          if (data.url) {
            setFormData((prev) => ({ ...prev, image_url: data.url }));
          } else {
            throw new Error('Upload failed');
          }
        } catch (error) {
          console.error('Upload error:', error);
          setImagePreview(base64);
          setFormData((prev) => ({ ...prev, image_url: base64 }));
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Ошибка при чтении файла');
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Заполните обязательные поля: название и содержание');
      return;
    }

    setLoading(true);

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit
        ? JSON.stringify({ ...formData, id: parseInt(id!) })
        : JSON.stringify(formData);

      const response = await fetch('https://functions.poehali.dev/bd8e2b39-63fc-4e49-a4d5-8ecfa98ddc76', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.ok) {
        navigate('/admin/interviews');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving interview:', error);
      alert('Ошибка при сохранении');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Icon name={isEdit ? 'Edit' : 'Plus'} size={32} className="text-red-600" />
            {isEdit ? 'Редактировать интервью' : 'Новое интервью'}
          </h1>

          <Button
            onClick={() => navigate('/admin/interviews')}
            variant="outline"
            className="border-red-600/30 text-white hover:bg-red-600/20"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="bg-black/80 backdrop-blur-sm border border-red-600/30 rounded-lg p-6 space-y-6">
          <div>
            <label className="text-white font-semibold mb-2 block">
              Название <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Введите название интервью"
              className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500"
              required
            />
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Подзаголовок</label>
            <Input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Краткое описание"
              className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Автор</label>
            <Input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Имя автора"
              className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">
              Содержание <span className="text-red-500">*</span>
            </label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Текст интервью"
              className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 min-h-[300px]"
              required
            />
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Изображение</label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-96 object-cover rounded border border-red-600/30"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, image_url: '' });
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700"
                    size="sm"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full bg-red-600/20 border border-red-600/30 hover:bg-red-600/30 text-white"
              >
                <Icon name={uploading ? 'Loader2' : 'Upload'} size={18} className={`mr-2 ${uploading ? 'animate-spin' : ''}`} />
                {uploading ? 'Загрузка...' : 'Выбрать изображение'}
              </Button>
            </div>
          </div>

          <div>
            <label className="text-white font-semibold mb-2 block">Категория</label>
            <Input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="interview"
              className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-5 h-5 rounded border-red-600/30 bg-black/50"
            />
            <label htmlFor="is_published" className="text-white font-semibold">
              Опубликовать сразу
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold"
            >
              {loading ? 'Сохранение...' : isEdit ? 'Сохранить изменения' : 'Создать интервью'}
            </Button>
            <Button
              type="button"
              onClick={() => navigate('/admin/interviews')}
              variant="outline"
              className="border-red-600/30 text-white hover:bg-red-600/20"
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
