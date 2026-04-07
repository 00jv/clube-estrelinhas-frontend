"use client";

import { useState, FormEvent } from "react";
import { Save, Store, Mail, MapPin, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SettingsAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
      
      // Remove a mensagem de salvo após 4 segundos
      setTimeout(() => {
        setIsSaved(false);
      }, 4000);
    }, 1200);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Configurações da Loja</h1>
        <p className="text-zinc-500 mt-2">Personalize os detalhes importantes, métodos de pagamento e segurança da sua marca artesanal.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Seção Principal - Info da Loja */}
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-serif text-zinc-900">Informações Básicas</h2>
          </div>
          <div className="w-full h-px bg-zinc-100 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">Nome da Loja</label>
              <input type="text" defaultValue="Clube Estrelinhas" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">Slogan ou Descrição Curta</label>
              <input type="text" defaultValue="A Arte do Fio Manual" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Mail className="w-4 h-4"/> E-mail de Contato Principal</label>
              <input type="email" defaultValue="contato@clubeestrelinhas.com.br" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
            </div>
          </div>
        </section>

        {/* Seção de Frete / Logística */}
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark">
               <Truck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold font-serif text-zinc-900">Logística e Entregas</h2>
          </div>
          <div className="w-full h-px bg-zinc-100 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> CEP de Origem (Remetente)</label>
              <input type="text" defaultValue="00000-000" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-zinc-50 transition-all font-mono" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">Prazo de Confecção Padrão (Dias úteis)</label>
              <input type="number" defaultValue="15" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
            </div>
          </div>
        </section>

        {/* Segurança e Legal */}
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-zinc-200">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary-dark">
               <ShieldCheck className="w-5 h-5" />
             </div>
             <h2 className="text-xl font-bold font-serif text-zinc-900">Documentos e Políticas</h2>
          </div>
          <div className="w-full h-px bg-zinc-100 mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
               <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">CNPJ (Opcional)</label>
               <input type="text" placeholder="00.000.000/0001-00" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
               <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">Políticas de Troca e Devolução de peças Manuáis</label>
               <textarea rows={4} defaultValue="Por se tratarem de peças exclusivas e sob encomenda, aceitamos devoluções em até 7 dias corridos apenas por defeitos de fábricação nos fios." className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* Action Bottom */}
        <div className="sticky bottom-4 z-40 bg-zinc-900/95 backdrop-blur-md p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 border border-zinc-800 shadow-2xl">
          <p className="text-sm font-medium text-zinc-400">
            {isSaved ? "As informações acabaram de ser salvas." : "Não se esqueça de salvar antes de sair."}
          </p>
          <div className="flex justify-end gap-3 w-full sm:w-auto">
            {isSaved && (
               <span className="flex items-center text-green-400 px-4 text-sm font-bold gap-2 animate-in fade-in slide-in-from-right-4">
                 <CheckCircle2 className="w-5 h-5" /> Salvo
               </span>
            )}
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark text-zinc-900 font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-sm w-full sm:w-auto min-w-[200px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><Save className="w-4 h-4" /> Salvar Alterações</>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
