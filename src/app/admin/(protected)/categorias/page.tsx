'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { getProducts, Product } from '@/lib/api';
import { Loader2, Tag, LayoutGrid, Package, ArrowRight, Plus, PieChart } from 'lucide-react';
import Link from 'next/link';

interface CategorySummary {
  name: string;
  productCount: number;
  totalValue: number;
}

export default function CategoriesAdmin() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const token = (session as { backendToken?: string })?.backendToken ?? '';

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, CategorySummary>();

    products.forEach(product => {
      const key = product.category;
      const existing = map.get(key);

      if (existing) {
        existing.productCount += 1;
        existing.totalValue += product.price;
      } else {
        map.set(key, {
          name: key,
          productCount: 1,
          totalValue: product.price,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.productCount - a.productCount);
  }, [products]);

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Categorias</h1>
          <p className="text-zinc-500 mt-2">Organize seu catálogo e veja a distribuição dos produtos.</p>
        </div>
        <button 
          className="bg-zinc-100 text-zinc-400 cursor-not-allowed px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
          title="Funcionalidade de adicionar nova categoria via modelo dedicada em breve"
        >
          <Plus className="w-5 h-5" /> Nova Categoria
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <Loader2 className="w-10 h-10 text-zinc-300 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            {categories.map((cat, index) => (
              <div key={index} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm flex items-center justify-between group hover:border-primary transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Tag className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-zinc-900">{cat.name}</h2>
                    <p className="text-sm text-zinc-500">{cat.productCount} produtos cadastrados</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Valor em Estoque</span>
                    <span className="font-bold text-zinc-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cat.totalValue)}</span>
                  </div>
                  <Link 
                    href={`/admin/produtos?category=${cat.name}`}
                    className="p-3 bg-zinc-50 text-zinc-400 rounded-xl group-hover:bg-primary group-hover:text-zinc-900 transition-all"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center flex flex-col items-center">
                <LayoutGrid className="w-12 h-12 text-zinc-200 mb-4" />
                <p className="text-zinc-500 font-medium">Nenhuma categoria encontrada.</p>
              </div>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-zinc-900 text-white rounded-3xl p-8 shadow-sm relative overflow-hidden">
               <div className="absolute -right-4 -bottom-4 text-white/5">
                 <PieChart className="w-32 h-32" />
               </div>
               <h3 className="text-xl font-bold font-serif mb-6 relative z-10">Resumo do Catálogo</h3>
               <div className="space-y-6 relative z-10">
                 <div className="flex items-center justify-between">
                   <span className="text-zinc-400 text-sm">Total de Categorias</span>
                   <span className="font-bold">{categories.length}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-zinc-400 text-sm">Mais Popular</span>
                   <span className="font-bold text-primary">{categories[0]?.name || '—'}</span>
                 </div>
                 <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                   <span className="text-zinc-400 text-sm">Total em Peças</span>
                   <span className="font-bold">{products.length}</span>
                 </div>
               </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Package className="w-5 h-5 text-primary-dark" />
                <h4 className="font-bold text-primary-dark">Dica de Gestão</h4>
              </div>
              <p className="text-sm text-primary-dark/80 leading-relaxed">
                Manter produtos bem categorizados ajuda na navegabilidade do site e nas suas métricas de venda por nicho.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
