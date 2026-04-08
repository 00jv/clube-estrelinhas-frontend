'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Plus, Pencil, Trash2, Package, Loader2 } from 'lucide-react';
import { getProducts, deleteProduct, Product } from '@/lib/api';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

function resolveImageUrl(image: string): string {
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`;
  return image;
}

export default function ProductsListAdmin() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    const data = await getProducts().catch(() => []);
    setProducts(data);
    setFiltered(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    let result = products;
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [search, category, products]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    const token = (session as { backendToken?: string })?.backendToken ?? '';
    setDeletingId(id);
    try {
      await deleteProduct(id, token);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Erro ao excluir produto.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Gerenciar Produtos</h1>
          <p className="text-zinc-500 mt-2">Veja, edite ou exclua os produtos atualmente ativos no catálogo.</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="bg-primary hover:bg-primary-dark text-zinc-900 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="w-5 h-5" /> Adicionar Produto
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome..."
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="flex-1 sm:w-auto px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 outline-none hover:border-zinc-300"
            >
              <option value="all">Todas as Categorias</option>
              <option value="Acessórios">Acessórios</option>
              <option value="Vestuário">Vestuário</option>
              <option value="Moda Praia">Moda Praia</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-zinc-50/50 text-xs uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço Venda</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={resolveImageUrl(product.image)} alt={product.name} className="object-cover w-full h-full" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 group-hover:text-primary transition-colors">{product.name}</p>
                          {product.tag && <p className="text-[10px] text-zinc-400 mt-0.5 uppercase tracking-widest">{product.tag}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 font-medium">{product.category}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest">
                        Ativo
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/admin/produtos/${product.id}`}
                          className="p-2 text-zinc-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                          aria-label="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 disabled:opacity-50"
                          aria-label="Excluir"
                        >
                          {deletingId === product.id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Package className="w-12 h-12 text-zinc-300 mb-4" />
              <p className="text-zinc-500 font-medium">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-100 p-4 flex justify-between items-center text-sm text-zinc-500 font-medium">
          <p>Mostrando {filtered.length} de {products.length} produtos</p>
        </div>
      </div>
    </div>
  );
}
