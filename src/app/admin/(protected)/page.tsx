'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getDashboardStats, DashboardStats, Order } from '@/lib/api';
import { CreditCard, DollarSign, Package, TrendingUp, Loader2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'Pendente',   color: 'bg-yellow-100 text-yellow-700' },
  PAID:      { label: 'Pago',       color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Entregue',   color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelado',  color: 'bg-red-100 text-red-700' },
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = (session as { backendToken?: string })?.backendToken ?? '';

  useEffect(() => {
    if (!token) return;
    getDashboardStats(token)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setIsLoading(false));
  }, [token]);

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-zinc-300 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { name: 'Receita Total', value: formatCurrency(stats?.totalRevenue ?? 0), icon: DollarSign },
    { name: 'Total de Pedidos', value: String(stats?.totalOrders ?? 0), icon: CreditCard },
    { name: 'Produtos Ativos', value: String(stats?.totalProducts ?? 0), icon: Package },
    { name: 'Últimos Pedidos', value: String(stats?.recentOrders?.length ?? 0), icon: ShoppingBag },
  ];

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Visão Geral</h1>
        <p className="text-zinc-500 mt-2">Acompanhe as métricas e últimos pedidos da sua loja em tempo real.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-600">
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-zinc-500 font-medium text-sm mb-1">{stat.name}</h3>
            <p className="text-3xl font-serif font-bold text-zinc-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
            <h2 className="text-xl font-bold font-serif text-zinc-900">Últimos Pedidos Recebidos</h2>
            <Link href="/admin/pedidos" className="text-sm text-primary-dark font-bold hover:underline">
              Ver Todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            {(stats?.recentOrders?.length ?? 0) === 0 ? (
              <div className="p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                <p className="text-zinc-400 font-medium">Nenhum pedido ainda.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-zinc-50/50 text-xs uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-100">
                  <tr>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Peça Principal</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {(stats?.recentOrders ?? []).map((order: Order) => {
                    const firstProduct = order.items[0]?.product?.name ?? '—';
                    const s = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-zinc-100 text-zinc-700' };
                    return (
                      <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-zinc-900">{order.customerName}</td>
                        <td className="px-6 py-4 text-zinc-700">{firstProduct}</td>
                        <td className="px-6 py-4 font-medium text-zinc-900">{formatCurrency(order.totalAmount)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${s.color}`}>
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Info box */}
        <div className="bg-zinc-900 rounded-3xl p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-primary/10">
            <TrendingUp className="w-48 h-48" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-4 relative z-10">Clube Estrelinhas</h2>
          <p className="text-zinc-400 mb-8 relative z-10">
            Sua loja está no ar! Adicione novos produtos, gerencie os pedidos e acompanhe sua receita por aqui.
          </p>
          <Link
            href="/admin/produtos/novo"
            className="bg-primary hover:bg-primary-dark text-zinc-900 font-bold py-3 rounded-xl transition-colors relative z-10 text-center"
          >
            Adicionar Produto
          </Link>
        </div>
      </div>
    </div>
  );
}
