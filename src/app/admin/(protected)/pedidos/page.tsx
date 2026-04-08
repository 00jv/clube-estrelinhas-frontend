'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getOrders, updateOrderStatus, Order } from '@/lib/api';
import { Loader2, ShoppingBag, ChevronDown, Eye } from 'lucide-react';
import Link from 'next/link';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'Pendente',   color: 'bg-yellow-100 text-yellow-700' },
  PAID:      { label: 'Pago',       color: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Entregue',   color: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelado',  color: 'bg-red-100 text-red-700' },
};

export default function OrdersAdminPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const token = (session as { backendToken?: string })?.backendToken ?? '';

  useEffect(() => {
    if (!token) return;
    getOrders(token)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus, token);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status } : o));
    } catch {
      alert('Erro ao atualizar status do pedido.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Pedidos</h1>
        <p className="text-zinc-500 mt-2">Gerencie todos os pedidos recebidos pela loja.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-zinc-300 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-zinc-50/50 text-xs uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4">Pedido</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Itens</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-400 font-medium">
                      <Link href={`/admin/pedidos/${order.id}`} className="hover:text-zinc-600">#{order.id.slice(0, 8)}</Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/pedidos/${order.id}`} className="font-bold text-zinc-900 hover:text-blue-600 transition-colors">{order.customerName}</Link>
                      {order.email && <p className="text-zinc-400 text-xs">{order.email}</p>}
                    </td>
                    <td className="px-6 py-4 text-zinc-600">
                      {order.items.map(item => (
                        <div key={item.id} className="text-xs">
                          {item.product?.name ?? 'Produto'} × {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        {updatingId === order.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                        ) : (
                          <div className="relative inline-flex items-center">
                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${STATUS_LABELS[order.status]?.color}`}>
                              {STATUS_LABELS[order.status]?.label}
                            </span>
                            <div className="ml-2 relative">
                              <select
                                value={order.status}
                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                className="appearance-none text-xs pl-2 pr-6 py-1 border border-zinc-200 rounded-lg bg-white text-zinc-600 cursor-pointer hover:border-zinc-400 transition-colors"
                              >
                                <option value="PENDING">Pendente</option>
                                <option value="PAID">Pago</option>
                                <option value="COMPLETED">Entregue</option>
                                <option value="CANCELLED">Cancelado</option>
                              </select>
                              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="p-2 text-zinc-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 inline-flex"
                        aria-label="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && orders.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-zinc-300 mb-4" />
              <p className="text-zinc-500 font-medium">Nenhum pedido recebido ainda.</p>
            </div>
          )}
        </div>

        <div className="border-t border-zinc-100 p-4 flex justify-between items-center text-sm text-zinc-500 font-medium">
          <p>{orders.length} pedido{orders.length !== 1 ? 's' : ''} no total</p>
          <p className="font-bold text-zinc-900">
            Receita total (pagos):&nbsp;
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              orders.filter(o => o.status === 'PAID' || o.status === 'COMPLETED')
                .reduce((s, o) => s + o.totalAmount, 0)
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
