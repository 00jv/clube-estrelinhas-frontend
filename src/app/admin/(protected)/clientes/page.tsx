'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { getOrders, Order } from '@/lib/api';
import { Loader2, Users, Search, Mail, Phone, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';

interface CustomerSummary {
  name: string;
  email: string | null | undefined;
  phone: string | null | undefined;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
}

export default function CustomersAdmin() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const token = (session as { backendToken?: string })?.backendToken ?? '';

  useEffect(() => {
    if (!token) return;
    getOrders(token)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [token]);

  const customers = useMemo(() => {
    const map = new Map<string, CustomerSummary>();

    orders.forEach(order => {
      // Use email as key, or name if email is missing
      const key = order.email || order.customerName;
      const existing = map.get(key);

      if (existing) {
        existing.totalSpent += order.totalAmount;
        existing.orderCount += 1;
        if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt;
        }
      } else {
        map.set(key, {
          name: order.customerName,
          email: order.email,
          phone: order.phone,
          totalSpent: order.totalAmount,
          orderCount: 1,
          lastOrderDate: order.createdAt,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Seus Clientes</h1>
          <p className="text-zinc-500 mt-2">Veja quem são as pessoas que apoiam sua arte.</p>
        </div>
        <div className="bg-zinc-900 text-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-lg border border-zinc-800">
           <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
             <Users className="w-5 h-5" />
           </div>
           <div>
             <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total de Clientes</p>
             <p className="text-2xl font-serif font-bold">{customers.length}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
        {/* Search */}
        <div className="p-6 border-b border-zinc-100">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome ou e-mail..."
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
            />
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
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Contato</th>
                  <th className="px-6 py-4 text-center">Pedidos</th>
                  <th className="px-6 py-4 text-right">Total Investido</th>
                  <th className="px-6 py-4">Última Compra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredCustomers.map((customer, index) => (
                  <tr key={index} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 font-serif font-bold text-sm border border-zinc-200 group-hover:border-primary group-hover:text-primary transition-colors">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="font-bold text-zinc-900">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {customer.email && (
                          <span className="flex items-center gap-1.5 text-zinc-500 text-xs italic">
                            <Mail className="w-3 h-3" /> {customer.email}
                          </span>
                        )}
                        {customer.phone && (
                          <span className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                            <Phone className="w-3 h-3" /> {customer.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-zinc-600">
                      <span className="bg-zinc-100 px-3 py-1 rounded-full text-xs">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className="font-serif font-bold text-zinc-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(customer.totalSpent)}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        {new Date(customer.lastOrderDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!isLoading && filteredCustomers.length === 0 && (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Users className="w-12 h-12 text-zinc-300 mb-4" />
              <p className="text-zinc-500 font-medium">Nenhum cliente encontrado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
             <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ticket Médio</p>
             <p className="text-2xl font-serif font-bold text-zinc-900">
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                 customers.length ? customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length : 0
               )}
             </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
             <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total em Compras</p>
             <p className="text-2xl font-serif font-bold text-zinc-900">
               {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                 customers.reduce((s, c) => s + c.totalSpent, 0)
               )}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
