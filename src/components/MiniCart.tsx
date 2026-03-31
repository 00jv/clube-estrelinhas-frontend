"use client";

import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MiniCart() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/40 backdrop-blur-[2px] z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="font-serif text-2xl font-bold text-zinc-900">Meu Carrinho</h2>
          <button onClick={closeCart} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-900">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p>Seu carrinho está vazio.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border border-zinc-100 rounded-2xl">
                <div className="relative w-24 h-24 bg-zinc-50 rounded-lg overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-medium text-zinc-900 line-clamp-2 leading-tight">{item.name}</h3>
                    <p className="text-sm font-semibold mt-2 text-zinc-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-zinc-50 rounded-full border border-zinc-200">
                      <button 
                        className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors disabled:opacity-50"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          } else {
                            removeItem(item.id);
                          }
                        }}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        className="w-8 h-8 flex items-center justify-center hover:text-primary transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-xs uppercase tracking-widest font-semibold text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
            <div className="flex justify-between items-end mb-6">
              <span className="text-zinc-500 uppercase tracking-widest font-bold text-xs">Subtotal</span>
              <span className="font-serif text-2xl font-bold text-zinc-900">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
              </span>
            </div>
            <Link 
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-primary hover:bg-primary-dark text-zinc-900 font-bold py-4 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-primary/20 uppercase tracking-wide text-sm"
            >
              Finalizar Compra
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
