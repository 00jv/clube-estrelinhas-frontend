"use client";

import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle2, CreditCard, Banknote } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import { useState } from "react";

export default function CheckoutPage() {
  const { items } = useCartStore();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal; // Frete Grátis

  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col pt-8 pb-32">
      <div className="container mx-auto px-4 lg:max-w-6xl">
        
        {/* Header Checkout */}
        <header className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div className="font-serif text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
            Clube Estrelinhas
          </div>
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border border-green-200">
            <Lock className="w-3 h-3" />
            <span className="hidden sm:inline">Pagamento Seguro</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Step 1 */}
            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-zinc-100">
              <div className="flex items-center gap-4 mb-8 border-b border-zinc-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-primary flex items-center justify-center font-bold text-sm">1</div>
                <h2 className="font-serif text-2xl font-bold text-zinc-900">Informações Pessoais</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Nome Completo</label>
                  <input type="text" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">E-mail</label>
                  <input type="email" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">CPF</label>
                  <input type="text" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Telefone</label>
                  <input type="tel" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
              </div>
            </section>

             {/* Step 2 */}
            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-zinc-100">
              <div className="flex items-center gap-4 mb-8 border-b border-zinc-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-primary flex items-center justify-center font-bold text-sm">2</div>
                <h2 className="font-serif text-2xl font-bold text-zinc-900">Endereço de Entrega</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">CEP</label>
                  <input type="text" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Endereço</label>
                  <input type="text" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Número</label>
                  <input type="text" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Complemento</label>
                  <input type="text" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Bairro</label>
                  <input type="text" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Cidade / UF</label>
                  <input type="text" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                </div>
              </div>
            </section>

            {/* Step 3 */}
            <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-zinc-100">
              <div className="flex items-center gap-4 mb-8 border-b border-zinc-100 pb-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-primary flex items-center justify-center font-bold text-sm">3</div>
                <h2 className="font-serif text-2xl font-bold text-zinc-900">Método de Pagamento</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/5 shadow-inner' : 'border-zinc-100 hover:border-zinc-300'}`}
                >
                  <CreditCard className={`w-8 h-8 ${paymentMethod === 'credit_card' ? 'text-primary' : 'text-zinc-400'}`} />
                  <span className={`font-bold text-xs uppercase tracking-widest ${paymentMethod === 'credit_card' ? 'text-zinc-900' : 'text-zinc-400'}`}>Cartão de Crédito</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod("pix")}
                  className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 transition-all ${paymentMethod === 'pix' ? 'border-primary bg-primary/5 shadow-inner' : 'border-zinc-100 hover:border-zinc-300'}`}
                >
                  <Banknote className={`w-8 h-8 ${paymentMethod === 'pix' ? 'text-primary' : 'text-zinc-400'}`} />
                  <span className={`font-bold text-xs uppercase tracking-widest ${paymentMethod === 'pix' ? 'text-zinc-900' : 'text-zinc-400'}`}>PIX</span>
                </button>
              </div>

              {paymentMethod === "credit_card" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Número do Cartão</label>
                    <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono" />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Nome Impresso</label>
                    <input type="text" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">Validade</label>
                    <input type="text" placeholder="MM/AA" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-2 ml-2">CVV</label>
                    <input type="password" placeholder="***" className="w-full border border-zinc-200 rounded-2xl px-5 py-4 bg-zinc-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-mono" />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-8 bg-zinc-900 text-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl flex flex-col gap-8">
              <h2 className="font-serif text-3xl font-bold tracking-tighter">Resumo do Pedido</h2>
              
              <div className="flex flex-col gap-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 opacity-50">
                    <p className="text-zinc-300 font-medium">Seu carrinho está vazio.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center border border-zinc-800 p-3 rounded-2xl bg-zinc-800/50">
                      <div className="relative w-16 h-16 bg-zinc-800 rounded-xl overflow-hidden shrink-0 border border-zinc-700/50">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-bold text-sm text-zinc-100 line-clamp-1">{item.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">Qtd: {item.quantity}</span>
                          <span className="font-bold text-white text-sm">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-zinc-800 pt-8 flex flex-col gap-4">
                <div className="flex justify-between text-zinc-400 text-sm font-medium">
                  <span className="uppercase tracking-widest text-xs font-bold">Subtotal</span>
                  <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-sm font-medium">
                  <span className="uppercase tracking-widest text-xs font-bold">Frete Expesso</span>
                  <span className="text-primary font-bold">Grátis</span>
                </div>
                
                <div className="flex justify-between items-end mt-4 pt-6 border-t border-zinc-800">
                  <span className="text-zinc-200 text-xs font-bold uppercase tracking-widest">Total Geração</span>
                  <span className="font-serif text-4xl text-primary font-bold tracking-tighter leading-none">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                  </span>
                </div>
              </div>

              <button 
                className="w-full bg-primary hover:bg-primary-dark text-zinc-900 font-bold py-5 rounded-full mt-4 flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(0,229,255,0.15)] hover:shadow-[0_0_40px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:shadow-none disabled:hover:bg-primary disabled:translate-y-0 hover:-translate-y-1 uppercase tracking-widest text-sm"
                disabled={items.length === 0}
              >
                <CheckCircle2 className="w-5 h-5" />
                Finalizar Compra Segura
              </button>

              <div className="flex items-center justify-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-2">
                <Lock className="w-3 h-3" />
                Seus dados estão protegidos
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
