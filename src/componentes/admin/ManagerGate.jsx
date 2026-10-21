import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';

const GATE_FLAG = 'ame_manager_unlocked';
const MANAGER_PASSWORD = '!@#qwe123';

export default function ManagerGate({ children }) {
  const [authorized, setAuthorized] = useState(() => sessionStorage.getItem(GATE_FLAG) === 'true');
  const [username, setUsername] = useState('Gerente');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = (e) => {
    e.preventDefault();
    if (username.trim().toLowerCase() !== 'gerente') {
      setError('Usuário não reconhecido.');
      return;
    }
    if (password !== MANAGER_PASSWORD) {
      setError('Senha incorreta. Tente novamente.');
      return;
    }
    sessionStorage.setItem(GATE_FLAG, 'true');
    setAuthorized(true);
  };

  if (authorized) return children;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-gold-15 velvet-card p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-20">
          <Lock className="h-6 w-6 text-gold" />
        </div>
        <h1 className="mt-4 font-display text-2xl">Acesso do gerente</h1>
        <p className="mt-2 text-sm text-[hsl(273_20%_76%)]">
          Confirme o usuário e a senha para acessar o painel.
        </p>
        <form onSubmit={handleUnlock} className="mt-6 space-y-3 text-left">
          <div className="space-y-2">
            <Label htmlFor="manager-user">Usuário</Label>
            <Input
              id="manager-user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Gerente"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manager-password">Senha</Label>
            <Input
              id="manager-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              required
            />
          </div>
          {error && <p className="text-sm text-[hsl(0_62%_60%)]">{error}</p>}
          <Button type="submit" className="w-full rounded-full bg-gold text-[hsl(285_74%_8%)] hover:bg-gold-soft">
            Desbloquear painel
          </Button>
        </form>
        <Button
          asChild
          variant="link"
          className="mt-3 text-xs text-[hsl(273_20%_74%)] hover:text-gold-soft"
        >
          <Link to="/">
            <ArrowLeft className="mr-1 h-3 w-3" />
            Voltar ao cardápio
          </Link>
        </Button>
      </div>
    </div>
  );
}