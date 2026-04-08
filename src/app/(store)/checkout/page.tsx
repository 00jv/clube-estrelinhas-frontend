"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, MapPin, Ruler, CreditCard, 
  ChevronRight, Loader2, ArrowLeft, 
  CheckCircle2, ShieldCheck, Truck
} from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { getProfile, createOrder } from '@/lib/api';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  
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

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0; // Grátis para simulação
  const total = subtotal + shipping;

  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push('/');
      return;
    }

    if (status === 'authenticated' && (session as any)?.backendToken) {
      loadUserData();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status, session, items]);

  async function loadUserData() {
    try {
      const profile = await getProfile((session as any).backendToken);
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
      console.error("Erro ao carregar dados do checkout:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCompletePurchase() {
    const token = (session as any)?.backendToken;
    if (!token) {
      alert("Sessão expirada. Por favor, faça login novamente.");
      router.push('/login');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulação de delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2500));

      await createOrder({
        userId: (session as any)?.user?.id,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        zipCode: formData.zipCode,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        bust: formData.bust ? parseFloat(formData.bust) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      }, token);

      clearCart();
      router.push('/checkout/sucesso');
    } catch (err) {
      console.error("Erro ao finalizar compra:", err);
      alert("Houve um erro ao processar seu pedido. Tente novamente.");
      setIsProcessing(false);
    }
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (isLoading && status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header simple */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="p-2 hover:bg-white rounded-full transition-all text-zinc-400 hover:text-zinc-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-serif font-bold text-zinc-900">Finalizar Compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Flow */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Entrega */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Endereço de Entrega</h2>
                  <p className="text-sm text-zinc-500">Onde enviaremos seu pedido.</p>
                </div>
              </div>

              {formData.street ? (
                <div className="bg-zinc-50 p-6 rounded-2xl border border-dashed border-zinc-200">
                  <p className="font-bold text-zinc-900">{formData.street}, {formData.number}</p>
                  <p className="text-zinc-500">{formData.neighborhood} - {formData.city}, {formData.state}</p>
                  <p className="text-zinc-400 text-sm mt-2">CEP: {formData.zipCode}</p>
                  
                  <Link href="/perfil" className="inline-flex items-center gap-2 text-sm text-primary font-bold mt-4 hover:underline">
                    Alterar Endereço <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-500 mb-4">Você ainda não cadastrou um endereço.</p>
                  <Link href="/perfil" className="bg-primary text-zinc-900 px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20">
                    Completar Perfil
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Medidas (Se aplicável) */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500">
                  <Ruler className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Suas Medidas</h2>
                  <p className="text-sm text-zinc-500">Usaremos estas medidas para o ajuste perfeito.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Busto', value: formData.bust },
                  { label: 'Cintura', value: formData.waist },
                  { label: 'Quadril', value: formData.hips },
                ].map((m, i) => (
                  <div key={i} className="bg-zinc-50 p-4 rounded-2xl text-center border border-zinc-100">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">{m.label}</p>
                    <p className="text-xl font-serif font-bold text-zinc-900">{m.value || '--'} <span className="text-xs font-sans font-normal text-zinc-400">cm</span></p>
                  </div>
                ))}
              </div>
              
              <Link href="/perfil" className="inline-flex items-center gap-2 text-sm text-cyan-500 font-bold mt-6 hover:underline">
                Atualizar minhas medidas <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3. Pagamento */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-zinc-900/5 rounded-xl flex items-center justify-center text-zinc-900">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">Método de Pagamento</h2>
                  <p className="text-sm text-zinc-500">Selecione como deseja pagar.</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setPaymentMethod('pix')}
                  className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-zinc-100 hover:border-zinc-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <img src="https://logopng.com.br/logos/pix-106.png" className="w-8 h-8 object-contain" alt="Pix" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-zinc-900">Pix</p>
                      <p className="text-xs text-green-600 font-bold">Aprovação imediata • 5% de desconto</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'pix' ? 'border-primary' : 'border-zinc-300'}`}>
                    {paymentMethod === 'pix' && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                </button>

                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-zinc-100 hover:border-zinc-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <CreditCard className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-zinc-900">Cartão de Crédito</p>
                      <p className="text-xs text-zinc-500">Até 10x sem juros</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-primary' : 'border-zinc-300'}`}>
                    {paymentMethod === 'card' && <div className="w-3 h-3 bg-primary rounded-full" />}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-900 rounded-[2rem] p-8 text-white sticky top-24 shadow-2xl shadow-zinc-200">
              <h2 className="text-2xl font-serif font-bold mb-8">Resumo do Pedido</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-zinc-400">{item.quantity}x • {item.category}</p>
                      <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Entrega Premium</span>
                  <span className="text-green-400 font-bold font-sans uppercase text-[10px] tracking-widest bg-green-400/10 px-2 py-1 rounded-full">Grátis</span>
                </div>
                
                {paymentMethod === 'pix' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Desconto Pix (5%)</span>
                    <span className="text-green-400 font-bold">-{formatPrice(subtotal * 0.05)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-serif font-bold text-primary">
                    {formatPrice(paymentMethod === 'pix' ? total * 0.95 : total)}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleCompletePurchase}
                disabled={isProcessing || !formData.street}
                className={`w-full mt-10 p-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${isProcessing ? 'bg-zinc-800 text-zinc-500' : 'bg-primary text-zinc-900 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20'}`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Confirmar e Pagar
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-8 grid grid-cols-2 gap-4 pt-8 border-t border-white/10">
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-zinc-500" />
                  <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Site Seguro</p>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-5 h-5 text-zinc-500" />
                  <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Envio Rápido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-zinc-900/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white p-6">
          <div className="relative mb-10">
            <div className="w-32 h-32 border-4 border-white/10 rounded-full" />
            <div className="absolute inset-0 w-32 h-32 border-4 border-primary rounded-full border-t-transparent animate-spin" />
            <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Garantindo sua elegância...</h2>
          <p className="text-zinc-400 text-center max-w-sm">Estamos processando sua transação segura. Não feche esta janela.</p>
        </div>
      )}
    </div>
  );
}
