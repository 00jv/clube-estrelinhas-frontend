"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('E-mail ou senha incorretos. Tente novamente.');
      } else {
        // Successful login
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen w-full flex bg-white font-sans overflow-hidden">
      <div className="w-full flex flex-col md:flex-row h-full">
        
        {/* Lado Esquerdo - Imagem e Branding (50% da tela) */}
        <div className="hidden md:flex md:w-1/2 relative h-full bg-zinc-900 overflow-hidden">
          <Image 
            src="/images/login-side.png" 
            alt="Crochê Artesanal Estrelinhas" 
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-end p-20">
            <h2 className="font-serif text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
              Clube<br />Estrelinhas
            </h2>
            <p className="text-zinc-200 max-w-sm text-lg leading-relaxed border-l-4 border-primary pl-6 italic">
              A elegância do feito à mão,<br />curada para o seu estilo de vida.
            </p>
          </div>
          <Link 
            href="/" 
            className="absolute top-10 left-10 text-white/90 hover:text-white transition-all flex items-center gap-3 text-sm font-bold backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-full group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Voltar à loja
          </Link>
        </div>

        {/* Lado Direito - Formulário (50% da tela) */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-white p-8 md:p-24 overflow-y-auto">
          <div className="max-w-md w-full mx-auto py-12">
            {/* Logo Mobile */}
            <div className="md:hidden mb-12">
               <Link href="/" className="font-serif text-3xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary rounded-xl shadow-lg shadow-primary/20"></div>
                 Clube Estrelinhas
               </Link>
            </div>

            <header className="mb-12">
              <h1 className="font-serif text-5xl font-bold text-zinc-900 mb-4">Bem-vindo</h1>
              <p className="text-zinc-500 text-lg font-medium">Acesse sua conta para explorar nossa galeria exclusiva.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    required
                    type="email" 
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    required
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer appearance-none w-5 h-5 rounded-md border border-zinc-200 checked:bg-primary checked:border-primary transition-all" />
                    <div className="absolute text-zinc-900 opacity-0 peer-checked:opacity-100 pointer-events-none text-[10px] font-bold">✓</div>
                  </div>
                  <span className="text-zinc-500 font-medium group-hover:text-zinc-700 transition-colors">Lembrar de mim</span>
                </label>
                <Link href="/auth/recuperar-senha" title="Esqueci minha senha" className="text-zinc-400 hover:text-primary font-medium transition-colors">
                  Esqueci minha senha
                </Link>
              </div>

              <button 
                disabled={isLoading}
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-zinc-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ENTRAR"}
              </button>
            </form>

            <footer className="mt-12 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-zinc-400 font-bold tracking-widest">Ou conecte-se com</span>
                </div>
              </div>

              <div className="flex justify-center gap-4 mb-10">
                <button className="flex items-center justify-center w-14 h-14 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-200 transition-all active:scale-95">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
                </button>
                <button className="flex items-center justify-center w-14 h-14 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-200 transition-all active:scale-95">
                  <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-6 h-6" />
                </button>
              </div>

              <p className="text-zinc-500 font-medium">
                Ainda não tem uma conta?{" "}
                <Link href="/cadastro" className="text-primary hover:text-primary-dark font-bold underline underline-offset-4 decoration-2">
                  Cadastre-se
                </Link>
              </p>
              
              <Link href="/" className="md:hidden mt-8 flex items-center justify-center gap-2 text-zinc-400 font-medium text-sm">
                <ArrowLeft className="w-4 h-4" /> Voltar para o início
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
