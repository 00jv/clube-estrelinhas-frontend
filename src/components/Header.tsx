"use client";

import Link from 'next/link';
import { Search, User, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Header() {
  const { items, toggleCart } = useCartStore();
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b flex items-center justify-center border-zinc-200">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold text-zinc-900 tracking-tight">
          Clube Estrelinhas
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <Link href="#" className="hover:text-primary transition-colors">Moda Praia</Link>
          <Link href="#" className="hover:text-primary transition-colors">Vestuário</Link>
          <Link href="#" className="hover:text-primary transition-colors">Acessórios</Link>
          <Link href="#" className="hover:text-primary transition-colors">Sob Encomenda</Link>
        </nav>

        <div className="flex items-center gap-5">
          <button aria-label="Buscar" className="hover:text-primary transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button aria-label="Usuário" className="hidden sm:block hover:text-primary transition-colors">
            <User className="w-5 h-5" />
          </button>
          <button 
            aria-label="Carrinho" 
            className="relative hover:text-primary transition-colors flex items-center"
            onClick={toggleCart}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-zinc-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
