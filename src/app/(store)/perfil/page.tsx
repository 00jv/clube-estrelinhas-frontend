"use client";

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, Mail, Phone, MapPin, 
  Ruler, Loader2, Save, UserCircle,
  Home, Hash, Building2, Map,
  ChevronRight, LogOut, ShoppingBag,
  Clock, CreditCard, Package, Truck,
  CheckCircle2, XCircle, X
} from 'lucide-react';
import { getProfile, updateProfile, getMyOrders, Order } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

function resolveImageUrl(image: string): string {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`;
  return image;
}

const STEPS = [
  { status: 'PENDING', label: 'Pagamento', icon: Clock },
  { status: 'PAID', label: 'Confirmado', icon: CreditCard },
  { status: 'PREPARING', label: 'Produção', icon: Package },
  { status: 'SHIPPED', label: 'Enviado', icon: Truck },
  { status: 'COMPLETED', label: 'Entregue', icon: CheckCircle2 },
];

function OrderStatusStepper({ currentStatus }: { currentStatus: string }) {
  const currentStep = STEPS.findIndex(s => s.status === currentStatus);
  const isCancelled = currentStatus === 'CANCELLED';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 mb-8 font-bold text-sm">
        <XCircle className="w-5 h-5" />
        ESTE PEDIDO FOI CANCELADO
      </div>
    );
  }

  return (
    <div className="mb-10 w-full">
      <div className="flex justify-between items-start relative px-2">
        {/* Progress Line */}
        <div className="absolute top-[1.35rem] left-[10%] right-[10%] h-[2px] bg-zinc-100 -z-0" />
        <div 
          className="absolute top-[1.35rem] left-[10%] h-[2px] bg-primary transition-all duration-1000 ease-out -z-0" 
          style={{ width: `${Math.max(0, currentStep * 20 + 5)}%` }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div key={idx} className="flex flex-col items-center gap-3 relative z-10 flex-1">
              <div 
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                  isDone 
                    ? 'bg-zinc-900 border-zinc-900 text-primary shadow-lg shadow-zinc-200' 
                    : 'bg-white border-zinc-100 text-zinc-300'
                } ${isCurrent ? 'scale-110 ring-4 ring-primary/20' : ''}`}
              >
                <Icon className={isCurrent ? 'w-6 h-6 animate-pulse' : 'w-5 h-5'} />
              </div>
              <div className="text-center">
                <p className={`text-[9px] uppercase tracking-widest font-bold transition-colors ${isDone ? 'text-zinc-900' : 'text-zinc-400'}`}>
                  {step.label}
                </p>
                {isCurrent && <span className="text-[7px] text-primary font-bold uppercase tracking-tighter leading-none block mt-0.5">Atual</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="bg-zinc-900 text-white p-8 md:p-10 relative overflow-hidden flex-shrink-0">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
          
          <button 
            onClick={onClose}
            className="absolute right-6 top-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors group z-10"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-zinc-900">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">Detalhes do Pedido</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold italic leading-none">
                #{(order.id as string).split('-')[0].toUpperCase()}
              </h2>
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                order.status === 'PAID' ? 'bg-green-500/20 text-green-400' :
                order.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                'bg-zinc-700 text-zinc-400'
              }`}>
                {order.status === 'PAID' ? 'Pago' : order.status === 'PENDING' ? 'Pendente' : order.status}
              </span>
              <p className="text-zinc-400 text-xs mt-2 font-medium">Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
          <div className="space-y-12">
            
            {/* Status Stepper */}
            <div className="bg-zinc-50 rounded-[2rem] p-8 border border-zinc-100/50">
              <OrderStatusStepper currentStatus={order.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Items List */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Itens da Compra
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-50 flex-shrink-0 shadow-sm">
                        {item.product && (
                          <img 
                            src={resolveImageUrl(item.product.image)} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-zinc-900 leading-tight">{item.product?.name || 'Produto'}</h4>
                        <p className="text-xs text-zinc-400 mt-1">{item.quantity}un × {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-zinc-900">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Measurements */}
              <div className="space-y-8">
                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Endereço de Entrega
                  </h3>
                  <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100/50">
                    {order.street ? (
                      <address className="not-italic text-sm text-zinc-600 leading-relaxed">
                        <span className="font-bold text-zinc-900">{order.street}, {order.number}</span><br />
                        {order.complement && <span className="text-xs">{order.complement}<br /></span>}
                        {order.neighborhood}<br />
                        {order.city} - {order.state}<br />
                        <span className="font-mono text-xs">{order.zipCode}</span>
                      </address>
                    ) : (
                      <p className="text-sm text-zinc-400 italic">Endereço não disponível.</p>
                    )}
                  </div>
                </div>

                {/* Measurements */}
                {(order.bust || order.waist || order.hips) && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                       <Ruler className="w-4 h-4" /> Medidas do Pedido
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-zinc-900 rounded-2xl p-4 text-center">
                        <p className="text-[8px] font-bold text-primary/60 uppercase tracking-tighter">Busto</p>
                        <p className="text-lg font-bold text-white leading-none mt-1">{order.bust || '—'} <span className="text-[10px] opacity-40 font-normal">cm</span></p>
                      </div>
                      <div className="bg-zinc-900 rounded-2xl p-4 text-center">
                        <p className="text-[8px] font-bold text-primary/60 uppercase tracking-tighter">Cintura</p>
                        <p className="text-lg font-bold text-white leading-none mt-1">{order.waist || '—'} <span className="text-[10px] opacity-40 font-normal">cm</span></p>
                      </div>
                      <div className="bg-zinc-900 rounded-2xl p-4 text-center">
                        <p className="text-[8px] font-bold text-primary/60 uppercase tracking-tighter">Quadril</p>
                        <p className="text-lg font-bold text-white leading-none mt-1">{order.hips || '—'} <span className="text-[10px] opacity-40 font-normal">cm</span></p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Total */}
        <div className="bg-zinc-50 p-8 md:px-10 md:py-8 border-t border-zinc-100 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Valor Total Pago</p>
            <p className="text-3xl font-serif font-bold text-zinc-900 italic">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalAmount)}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold shadow-lg shadow-zinc-200 transition-all active:scale-95 text-sm"
          >
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'personal' | 'address' | 'measurements' | 'orders'>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    bust: '',
    waist: '',
    hips: '',
  });

  // Atualiza dados básicos da sessão IMEDIATAMENTE quando disponível
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    if (status === 'authenticated' && (session as any)?.backendToken) {
      loadProfile();
    }
  }, [status, session]);

  // Carrega pedidos automaticamente ao entrar na aba
  useEffect(() => {
    if (activeTab === 'orders' && (session as any)?.backendToken) {
      loadMyOrders();
    }
  }, [activeTab, session]);

  async function loadMyOrders() {
    setIsLoadingOrders(true);
    try {
      const token = (session as any)?.backendToken;
      if (!token) return;

      const data = await getMyOrders(token);
      setOrders(data);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  }

  async function loadProfile() {
    try {
      const token = (session as any)?.backendToken;
      if (!token) return;

      const profile = await getProfile(token);
      
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        zipCode: profile.zipCode || '',
        street: profile.street || '',
        number: profile.number || '',
        complement: profile.complement || '',
        neighborhood: profile.neighborhood || '',
        city: profile.city || '',
        state: profile.state || '',
        bust: profile.bust?.toString() || '',
        waist: profile.waist?.toString() || '',
        hips: profile.hips?.toString() || '',
      });
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleZipCodeLookup = async (cepValue: string) => {
    const cep = cepValue.replace(/\D/g, '');
    if (cep.length !== 8) return;

    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        }));
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    } finally {
      setIsFetchingCep(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!(session as any)?.backendToken) return;

    setIsSaving(true);
    try {
      await updateProfile({
        ...formData,
        bust: formData.bust ? parseFloat(formData.bust) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
      }, (session as any).backendToken);
      
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert('Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  }

  // Se a sessão ainda está carregando, mostramos um spinner centralizado
  // Mas assim que a sessão existe, mostramos a página, mesmo que os dados do perfil banco ainda estejam vindo
  if (status === 'loading') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 font-sans">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-80 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-zinc-100/50 border border-zinc-50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <UserCircle className="w-10 h-10" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-zinc-900 leading-tight truncate w-40">
                  {formData.name.split(' ')[0]}
                </h2>
                <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Minha Conta</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'personal' ? 'bg-primary text-zinc-900 shadow-lg shadow-primary/20 font-bold' : 'hover:bg-zinc-50 text-zinc-500 font-medium'}`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <span>Dados Pessoais</span>
                </div>
                {activeTab === 'personal' && <ChevronRight className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'address' ? 'bg-primary text-zinc-900 shadow-lg shadow-primary/20 font-bold' : 'hover:bg-zinc-50 text-zinc-500 font-medium'}`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <span>Endereço</span>
                </div>
                {activeTab === 'address' && <ChevronRight className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => setActiveTab('measurements')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'measurements' ? 'bg-primary text-zinc-900 shadow-lg shadow-primary/20 font-bold' : 'hover:bg-zinc-50 text-zinc-500 font-medium'}`}
              >
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5" />
                  <span>Suas Medidas</span>
                </div>
                {activeTab === 'measurements' && <ChevronRight className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-primary text-zinc-900 shadow-lg shadow-primary/20 font-bold' : 'hover:bg-zinc-50 text-zinc-500 font-medium'}`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  <span>Meus Pedidos</span>
                </div>
                {activeTab === 'orders' && <ChevronRight className="w-4 h-4" />}
              </button>
            </nav>


            <div className="pt-8 mt-8 border-t border-zinc-100">
               <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-50 transition-all font-bold"
               >
                 <LogOut className="w-5 h-5" />
                 Sair
               </button>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-zinc-100/50 border border-zinc-50 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            
            <header className="mb-12 relative z-10">
              <h1 className="font-serif text-4xl font-bold text-zinc-900 mb-2 italic">
                {activeTab === 'personal' && "Dados Pessoais"}
                {activeTab === 'address' && "Endereço de Entrega"}
                {activeTab === 'measurements' && "Suas Medidas Corporais"}
                {activeTab === 'orders' && "Meus Pedidos"}
              </h1>
              <p className="text-zinc-500 font-medium">
                {activeTab === 'personal' && "Atualize suas informações básicos de contato e perfil."}
                {activeTab === 'address' && "Onde enviamos suas peças de crochê feitas à mão."}
                {activeTab === 'measurements' && "Lembre-se: dados precisos garantem peças com o ajuste perfeito."}
                {activeTab === 'orders' && "Acompanhe o status e histórico de suas compras."}
              </p>
            </header>

            {activeTab !== 'orders' ? (
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                
                {/* TAB: PERSONAL */}
                {activeTab === 'personal' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Nome Completo</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">E-mail</label>
                      <div className="relative group opacity-60">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                        <input 
                          disabled
                          type="email" 
                          value={formData.email}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-100 border border-zinc-100 rounded-2xl font-medium text-zinc-400 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">WhatsApp / Celular</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                          placeholder="(00) 00000-0000"
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: ADDRESS */}
                {activeTab === 'address' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">CEP</label>
                        <div className="relative group">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                          <input 
                            type="text" 
                            value={formData.zipCode}
                            onChange={e => {
                              const val = maskCEP(e.target.value);
                              setFormData({ ...formData, zipCode: val });
                              if (val.length === 9) handleZipCodeLookup(val);
                            }}
                            placeholder="00000-000"
                            className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                          />
                          {isFetchingCep && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />}
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Rua / Logradouro</label>
                        <div className="relative group">
                          <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 focus-within:text-primary" />
                          <input 
                            type="text" 
                            value={formData.street}
                            onChange={e => setFormData({ ...formData, street: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Número</label>
                        <input 
                          type="text" 
                          value={formData.number}
                          onChange={e => setFormData({ ...formData, number: e.target.value })}
                          className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Complemento</label>
                        <input 
                          type="text" 
                          value={formData.complement}
                          onChange={e => setFormData({ ...formData, complement: e.target.value })}
                          className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Bairro</label>
                        <input 
                          type="text" 
                          value={formData.neighborhood}
                          onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                          className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Cidade</label>
                        <input 
                          type="text" 
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Estado (UF)</label>
                        <input 
                          type="text" 
                          maxLength={2}
                          value={formData.state}
                          onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                          className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: MEASUREMENTS */}
                {activeTab === 'measurements' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <p className="text-zinc-400 text-sm max-w-xl">
                      Suas medidas são fundamentais para que possamos sugerir o ajuste perfeito em nossas peças exclusivas. Todos os valores são em **centímetros (cm)**.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-4">
                        <div className="w-14 h-14 bg-white border border-zinc-100 shadow-sm rounded-2xl flex items-center justify-center text-primary mx-auto">
                          <Ruler className="w-7 h-7" />
                        </div>
                        <div className="text-center">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Busto (cm)</label>
                          <input 
                            type="number" 
                            value={formData.bust}
                            onChange={e => setFormData({ ...formData, bust: e.target.value })}
                            className="w-full mt-2 px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center font-bold text-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="w-14 h-14 bg-white border border-zinc-100 shadow-sm rounded-2xl flex items-center justify-center text-primary mx-auto">
                          <Ruler className="w-7 h-7 rotate-45" />
                        </div>
                        <div className="text-center">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Cintura (cm)</label>
                          <input 
                            type="number" 
                            value={formData.waist}
                            onChange={e => setFormData({ ...formData, waist: e.target.value })}
                            className="w-full mt-2 px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center font-bold text-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="w-14 h-14 bg-white border border-zinc-100 shadow-sm rounded-2xl flex items-center justify-center text-primary mx-auto">
                          <Ruler className="w-7 h-7 -rotate-45" />
                        </div>
                        <div className="text-center">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Quadril (cm)</label>
                          <input 
                            type="number" 
                            value={formData.hips}
                            onChange={e => setFormData({ ...formData, hips: e.target.value })}
                            className="w-full mt-2 px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center font-bold text-xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="pt-10 mt-10 border-t border-zinc-50 flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-xs text-zinc-400 flex items-center gap-2 italic">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    Suas alterações são salvas com segurança e privacidade.
                  </p>
                  <button 
                    disabled={isSaving}
                    type="submit"
                    className="w-full md:w-auto px-12 py-5 bg-zinc-900 hover:bg-black text-white font-bold rounded-2xl shadow-xl shadow-zinc-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3 group"
                  >
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                    SALVAR ALTERAÇÕES
                  </button>
                </div>
              </form>
            ) : (
              /* Orders Section */
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                {isLoadingOrders ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-zinc-400 font-medium italic">Buscando seu histórico...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-[2rem] border border-zinc-100 p-8 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all group">
                        <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-100">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-zinc-200">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">Pedido</p>
                              <p className="font-serif font-bold text-zinc-900">#{(order.id as string).split('-')[0].toUpperCase()}</p>
                            </div>
                          </div>

                          <div className="flex gap-10">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">Data</p>
                              <p className="font-bold text-zinc-900">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">Status</p>
                              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'PAID' ? 'bg-green-100 text-green-600' :
                                order.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                'bg-zinc-100 text-zinc-500'
                              }`}>
                                {order.status === 'PAID' ? 'Pago' : order.status === 'PENDING' ? 'Pendente' : order.status}
                              </span>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">Total</p>
                              <p className="text-xl font-serif font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalAmount)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status Stepper Visual */}
                        <OrderStatusStepper currentStatus={order.status} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Items Miniatures */}
                          <div className="flex flex-wrap gap-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="relative group/item cursor-pointer">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-100 bg-zinc-50 shadow-sm transition-transform group-hover/item:scale-110">
                                  {item.product && (
                                    <img 
                                      src={resolveImageUrl(item.product.image)} 
                                      alt={item.product.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-900 text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow-lg border-2 border-white">
                                  {item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-end">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-2 text-zinc-400 font-bold text-sm hover:text-zinc-900 transition-colors group"
                            >
                              Ver detalhes <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[2rem] border-2 border-dashed border-zinc-100 p-20 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-200 mb-6">
                      <ShoppingBag className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">Nenhum pedido ainda</h3>
                    <p className="text-zinc-500 max-w-xs mb-8 italic">Sua jornada de estilo ainda está para começar. Que tal escolher sua primeira peça?</p>
                    <Link href="/" className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all">
                      Explorar Coleções
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedOrder && (
        <OrderModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}
