'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError('E-mail ou senha incorretos. Tente novamente.');
    } else {
      router.push('/admin');
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel – decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 flex-col items-center justify-center overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-300/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
          </div>
          <h1 className="font-serif text-5xl font-bold text-white leading-tight">
            Clube<br />Estrelinhas
          </h1>
          <p className="text-zinc-400 text-lg max-w-xs">
            Painel de controle exclusivo para gerenciar sua loja artesanal com amor e elegância.
          </p>

        </div>
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900 to-transparent" />
      </div>

      {/* Right panel – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-zinc-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-serif text-2xl font-bold text-zinc-900">Clube Estrelinhas</span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-zinc-900">Bem-vinda de volta 💛</h2>
            <p className="text-zinc-500 mt-2">Acesse o painel da sua loja.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* E-mail */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="border border-zinc-200 bg-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all font-medium text-zinc-900 placeholder:text-zinc-300"
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-zinc-200 bg-white rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all font-medium text-zinc-900 placeholder:text-zinc-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors"
                  aria-label="Mostrar senha"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 bg-zinc-900 hover:bg-zinc-700 disabled:opacity-60 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm uppercase tracking-widest"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-400 mt-10">
            Clube Estrelinhas &copy; {new Date().getFullYear()} · Painel Administrativo
          </p>
        </div>
      </div>
    </div>
  );
}
