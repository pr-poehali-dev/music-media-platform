import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === 'admin2024') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin/interviews');
    } else {
      setError('Неверный пароль');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-black/80 backdrop-blur-sm border border-red-600/30 rounded-lg p-8 shadow-2xl">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-3 rounded-full">
              <Icon name="Lock" size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Админ-панель
          </h1>
          
          <p className="text-gray-400 text-center mb-8">
            Введите пароль для доступа
          </p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="bg-black/50 border-red-600/30 text-white placeholder:text-gray-500 focus:border-red-600"
                autoFocus
              />
            </div>
            
            {error && (
              <div className="bg-red-600/20 border border-red-600/50 rounded p-3 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold"
            >
              Войти
            </Button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Вернуться на главную
          </button>
        </div>
      </div>
    </div>
  );
}
