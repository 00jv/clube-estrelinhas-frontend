"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useSession, signOut } from 'next-auth/react';
import { getProducts } from '@/lib/api';
import { slugify } from '@/lib/slugify';

export default function Header() {
  const { items, toggleCart } = useCartStore();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    getProducts().then(products => {
      const uniqueCategories = Array.from(new Set(products.map(p => p.category)));
      setCategories(uniqueCategories);
    }).catch(console.error);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b flex items-center justify-center border-zinc-200">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="font-serif text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">
              Clube Estrelinhas
            </Link>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium items-center">
            <Link href="/" className="hover:text-primary transition-colors py-2">Início</Link>
            
            {/* Dropdown Categorias */}
            <div 
              className="relative group h-20 flex items-center"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-primary transition-colors py-2 h-full">
                Categorias <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu Overlay */}
              <div className={`absolute top-full left-0 w-56 bg-white border border-zinc-100 shadow-xl rounded-b-2xl py-4 transition-all duration-300 origin-top transform ${isDropdownOpen ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'}`}>
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <Link 
                      key={cat}
                      href={`/categoria/${slugify(cat)}`}
                      className="block px-6 py-3 text-zinc-600 hover:text-primary hover:bg-zinc-50 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))
                ) : (
                  <span className="block px-6 py-3 text-zinc-400 italic">Nenhuma categoria</span>
                )}
              </div>
            </div>

            <Link href="/sob-encomenda" className="hover:text-primary transition-colors py-2">Sob Encomenda</Link>
          </nav>

          <div className="flex items-center gap-5">
            <button aria-label="Buscar" className="hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link 
              href={session ? "/perfil" : "/login"} 
              aria-label="Usuário" 
              className="hover:text-primary transition-colors flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              {session && (
                <span className="hidden lg:block text-xs font-bold text-zinc-900 truncate max-w-[80px]">
                  {session.user?.name?.split(' ')[0]}
                </span>
              )}
            </Link>
            <button 
              aria-label="Carrinho" 
              className="relative hover:text-primary transition-colors flex items-center"
              onClick={toggleCart}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-zinc-900 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer Content */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 z-[70] w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <span className="font-serif text-xl font-bold text-zinc-900">Menu</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fechar menu"
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-6 flex flex-col gap-6">
          <Link 
            href="/" 
            className="text-lg font-bold text-zinc-900 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Início
          </Link>

          <div className="flex flex-col gap-4 pt-4 border-t border-zinc-100">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Categorias</span>
            {categories.map(cat => (
              <Link 
                key={cat}
                href={`/categoria/${slugify(cat)}`}
                className="text-xl font-serif text-zinc-600 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {cat}
              </Link>
            ))}
          </div>

          <Link 
            href="/sob-encomenda" 
            className="pt-4 border-t border-zinc-100 text-lg font-bold text-zinc-900 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sob Encomenda
          </Link>


          <Link 
            href={session ? "/perfil" : "/login"} 
            className="pt-4 border-t border-zinc-100 text-lg font-bold text-zinc-900 hover:text-primary transition-colors flex items-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User className="w-5 h-5" /> {session ? 'Minha Conta' : 'Fazer Login'}
          </Link>

          {session && (
            <button 
              onClick={() => {
                setIsMobileMenuOpen(false);
                signOut({ callbackUrl: '/' });
              }}
              className="text-lg font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2 pt-2"
            >
              <LogOut className="w-5 h-5" /> Sair
            </button>
          )}
        </nav>
        
        <div className="absolute bottom-10 left-6 right-6 p-6 bg-zinc-50 rounded-2xl">
          <p className="text-xs text-zinc-500 text-center">Fale conosco pelo WhatsApp para encomendas personalizadas.</p>
        </div>
      </aside>
    </>
  );
}
