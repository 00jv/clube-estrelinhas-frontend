"use client";

import { CheckCircle2, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

export default function SuccessPage() {
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    // Gerar um número de pedido aleatório para a simulação
    const random = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(`EST-${random}`);

    // Solo de confetes premium
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8 animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 mb-4">Pedido Realizado!</h1>
      <p className="text-zinc-500 text-lg mb-10 max-w-md">
        Obrigado por escolher o Clube Estrelinhas. Sua peça exclusiva já está sendo preparada com todo amor.
      </p>

      <div className="bg-zinc-50 rounded-[2rem] p-8 w-full max-w-md border border-zinc-100 mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Número do Pedido</span>
          <span className="text-zinc-900 font-bold">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest">Status</span>
          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">PAGAMENTO APROVADO</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link 
          href="/"
          className="flex-1 bg-zinc-900 text-white p-5 rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-5 h-5" />
          Continuar Comprando
        </Link>
        <Link 
          href="/perfil"
          className="flex-1 bg-white border border-zinc-200 text-zinc-900 p-5 rounded-2xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
        >
          Meus Pedidos
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="mt-20 flex items-center gap-2 text-zinc-400 text-sm">
        <Heart className="w-4 h-4 text-red-400 fill-red-400" />
        Feito à mão para você
      </div>
    </div>
  );
}
