'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getOrderById, updateOrderStatus, Order } from '@/lib/api';
import { Loader2, ArrowLeft, Package, User, ShoppingBag, MapPin, Phone, Mail, Calendar, CreditCard, CheckCircle2, Clock, AlertTriangle, XCircle, Truck } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

function resolveImageUrl(image: string): string {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`;
  return image;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; description: string }> = {
  PENDING:   { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-700', icon: Clock, description: 'O cliente ainda não confirmou o pagamento.' },
  PAID:      { label: 'Confirmado / Fila', color: 'bg-blue-100 text-blue-700', icon: CreditCard, description: 'Pagamento confirmado. O pedido está na fila para produção.' },
  PREPARING: { label: 'Em Produção', color: 'bg-purple-100 text-purple-700', icon: Package, description: 'A peça está sendo produzida com todo carinho.' },
  SHIPPED:   { label: 'Enviado', color: 'bg-cyan-100 text-cyan-700', icon: Truck, description: 'O pedido já foi postado e está a caminho.' },
  COMPLETED: { label: 'Entregue', color: 'bg-green-100 text-green-700', icon: CheckCircle2, description: 'Pedido finalizado e entregue ao cliente.' },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XCircle, description: 'Pedido foi cancelado.' },
};

export default function OrderDetailsAdmin() {
  const { id } = useParams();
  const { data: session } = useSession();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const token = (session as { backendToken?: string })?.backendToken ?? '';

  const loadOrder = useCallback(async () => {
    if (!id || !token) return;
    try {
      const data = await getOrderById(id as string, token);
      setOrder(data);
    } catch {
      setError('Erro ao carregar detalhes do pedido.');
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    setIsUpdating(true);
    try {
      const updated = await updateOrderStatus(order.id, newStatus, token);
      setOrder(prev => prev ? { ...prev, status: updated.status } : null);
    } catch {
      alert('Erro ao atualizar status.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-zinc-300 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-12 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-serif font-bold text-zinc-900 mb-2">Ops!</h2>
        <p className="text-zinc-500 mb-6">{error || 'Pedido não encontrado.'}</p>
        <Link href="/admin/pedidos" className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold">
          Voltar para pedidos
        </Link>
      </div>
    );
  }

  const currentStatus = STATUS_CONFIG[order.status] ?? { label: order.status, color: 'bg-zinc-100 text-zinc-700', icon: Package, description: '' };
  const StatusIcon = currentStatus.icon;

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/pedidos" className="text-zinc-400 hover:text-zinc-600 flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar para pedidos
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Pedido #{order.id.slice(0, 8)}</h1>
            <div className="flex items-center gap-4 mt-2 text-zinc-500">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(order.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {order.status === 'PENDING' && (
              <button
                onClick={() => handleStatusChange('PAID')}
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Confirmar Pagamento
              </button>
            )}
            {order.status === 'PAID' && (
              <button
                onClick={() => handleStatusChange('PREPARING')}
                disabled={isUpdating}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                Iniciar Produção
              </button>
            )}
            {order.status === 'PREPARING' && (
              <button
                onClick={() => handleStatusChange('SHIPPED')}
                disabled={isUpdating}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                Marcar como Enviado
              </button>
            )}
            {order.status === 'SHIPPED' && (
              <button
                onClick={() => handleStatusChange('COMPLETED')}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Marcar como Entregue
              </button>
            )}
            {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
              <button
                onClick={() => handleStatusChange('CANCELLED')}
                disabled={isUpdating}
                className="border border-red-200 text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Items and Customer */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Status Banner */}
          <div className={`${currentStatus.color} rounded-3xl p-6 flex items-start gap-4 shadow-sm border border-zinc-100`}>
            <div className="w-12 h-12 rounded-2xl bg-white/50 flex items-center justify-center flex-shrink-0">
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Status atual: {currentStatus.label}</h3>
              <p className="text-sm opacity-80">{currentStatus.description}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-400" />
              <h2 className="text-xl font-bold font-serif text-zinc-900">Itens do Pedido</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50/50 text-xs uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-100">
                  <tr>
                    <th className="px-6 py-4">Produto</th>
                    <th className="px-6 py-4 text-center">Quantidade</th>
                    <th className="px-6 py-4 text-right">Preço Un.</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {order.items.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-zinc-100 flex-shrink-0 overflow-hidden border border-zinc-200">
                            {item.product?.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img 
                                src={resolveImageUrl(item.product.image)} 
                                alt={item.product.name} 
                                className="w-full h-full object-cover" 
                              />
                            ) : <div className="w-full h-full flex items-center justify-center text-zinc-300"><Package className="w-6 h-6" /></div>}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900">{item.product?.name ?? 'Produto Removido'}</p>
                            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">{item.product?.category ?? '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-zinc-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-zinc-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</td>
                      <td className="px-6 py-4 text-right font-bold text-zinc-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-zinc-50/30">
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-right font-bold text-zinc-500 uppercase tracking-widest text-xs">Total do Pedido</td>
                    <td className="px-6 py-6 text-right font-serif text-2xl font-bold text-zinc-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalAmount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details */}
        <div className="flex flex-col gap-6">
          <div className="bg-zinc-900 text-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold font-serif">Dados do Cliente</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Nome Completo</span>
                <span className="font-bold text-lg">{order.customerName}</span>
              </div>
              
              {order.email && (
                <div className="flex flex-col gap-1 text-zinc-300">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">E-mail</span>
                  <a href={`mailto:${order.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 text-primary" /> {order.email}
                  </a>
                </div>
              )}

              {order.phone && (
                <div className="flex flex-col gap-1 text-zinc-300">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Telefone</span>
                  <a href={`tel:${order.phone}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Phone className="w-4 h-4 text-primary" /> {order.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-200">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-100 pb-4">
              <MapPin className="w-5 h-5 text-zinc-400" />
              <h2 className="text-xl font-bold font-serif text-zinc-900">Entrega</h2>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed italic">
              "Dados de endereço podem ser adicionados no futuro. Por enquanto, a comunicação é feita via WhatsApp/E-mail."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
