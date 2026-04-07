"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { UploadCloud, CheckCircle2, Scissors, Palette, Ruler, Send } from "lucide-react";

export default function SobEncomenda() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    tipo: "vestuario",
    cor: "",
    fio: "algodao_organico",
    medidas: "",
    descricao: ""
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simula envio para API
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="w-full min-h-[70vh] bg-zinc-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 md:p-16 rounded-[2rem] shadow-xl max-w-xl text-center flex flex-col items-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-primary-dark" />
          </div>
          <h2 className="font-serif text-4xl font-bold text-zinc-900 mb-4">Pedido Recebido!</h2>
          <p className="text-zinc-600 text-lg leading-relaxed mb-8">
            Sua solicitação de peça sob encomenda foi enviada com sucesso para nossa equipe de artesãs. Analisaremos as medidas, cores e referências.
            Em breve entraremos em contato pelo WhatsApp fornecido para combinarmos os últimos detalhes e orçamentos!
          </p>
          <button 
            onClick={() => { setIsSubmitted(false); setImagePreview(null); }}
            className="bg-zinc-900 text-white font-bold px-10 py-4 rounded-full hover:bg-zinc-800 transition-colors tracking-widest text-sm uppercase"
          >
            Fazer Novo Pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-32">
      {/* Hero Header */}
      <section className="w-full bg-zinc-900 text-white py-24 md:py-32 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('/CardPrincipal.png')] opacity-20 bg-cover bg-center"></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-zinc-900/90"></div>
        <div className="relative z-10 max-w-3xl flex flex-col items-center">
          <span className="text-primary font-bold tracking-[0.2em] text-sm uppercase mb-6 flex items-center gap-2">
            <Scissors className="w-4 h-4" /> Peça Única, Como Você.
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
            Crie sua Peça<br/>Sob Encomenda
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
            Seja uma roupa especial para um momento inesquecível ou a bolsa dos sonhos. Faça o upload da sua referência e daremos vida à sua ideia através dos fios.
          </p>
        </div>
      </section>

      {/* Form Container */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 flex justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-12 lg:p-16 border border-zinc-100 flex flex-col gap-12">
          
          {/* Informações Pessoais */}
          <div>
            <h3 className="text-xl font-serif font-bold text-zinc-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-sans text-sm">1</span> 
              Seus Dados para Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Nome Completo</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleInputChange} placeholder="Ex: Maria Carolina" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-zinc-50 transition-all font-medium" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Seu WhatsApp</label>
                <input required type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} placeholder="(00) 00000-0000" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-zinc-50 transition-all font-medium" />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Seu E-mail</label>
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="maria@exemplo.com" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-zinc-50 transition-all font-medium" />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-100" />

          {/* Referência Visual */}
          <div>
            <h3 className="text-xl font-serif font-bold text-zinc-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-sans text-sm">2</span> 
              Imagem de Referência
            </h3>
            <div className="w-full relative">
              <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} className="hidden" />
              <label htmlFor="imageUpload" className={`w-full border-2 border-dashed ${imagePreview ? 'border-primary bg-primary/5' : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50'} rounded-2xl flex flex-col items-center justify-center p-12 cursor-pointer transition-all group overflow-hidden`}>
                {imagePreview ? (
                  <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview da peça" className="object-contain w-full h-full mb-4" />
                    <span className="text-primary-dark font-bold underline text-sm z-10">Trocar Imagem</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-12 h-12 text-zinc-400 group-hover:text-primary transition-colors mb-4" />
                    <p className="font-bold text-zinc-700 text-lg mb-1">Fazer Upload de Foto ou Esboço</p>
                    <p className="text-zinc-500 text-sm font-medium">Suporta PNG, JPG ou JPEG até 5MB.</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="w-full h-px bg-zinc-100" />

          {/* Características da Peça */}
          <div>
            <h3 className="text-xl font-serif font-bold text-zinc-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-sans text-sm">3</span> 
              Características e Medidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest flex items-center gap-2"><Palette className="w-4 h-4"/> Cor Desejada</label>
                <input required type="text" name="cor" value={formData.cor} onChange={handleInputChange} placeholder="Ex: Azul Petróleo, Terracota ou Verde Musgo" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-zinc-50 transition-all font-medium" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Tipo de Peça</label>
                <div className="relative">
                  <select name="tipo" value={formData.tipo} onChange={handleInputChange} className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-zinc-50 transition-all font-medium appearance-none">
                    <option value="vestuario">Vestuário (Blusa, Saia, Vestido)</option>
                    <option value="moda_praia">Moda Praia (Biquíni, Maiô)</option>
                    <option value="bolsa">Bolsa ou Acessório</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Fio Preferencial (Opcional)</label>
                <select name="fio" value={formData.fio} onChange={handleInputChange} className="w-full border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-zinc-50 transition-all font-medium appearance-none">
                  <option value="algodao_organico">Algodão Orgânico (Leve e Macio)</option>
                  <option value="barbante">Barbante Cru (Rústico e Estruturado)</option>
                  <option value="fio_nautico">Fio Náutico (Ideal p/ Bolsas)</option>
                  <option value="lurex">Fio com Brilho/Lurex (Festas)</option>
                  <option value="ns">Não sei/Aceito Sugestão da Artesã</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest flex items-center gap-2"><Ruler className="w-4 h-4"/> Suas Medidas Exatas</label>
                <textarea required name="medidas" value={formData.medidas} onChange={handleInputChange} placeholder="Passe as medidas de busto, cintura, quadril ou seu manequim (ex: Visto 38). Se for bolsa, o tamanho aproximado (20x30cm)." rows={4} className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-zinc-50 transition-all font-medium resize-none"></textarea>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Descrição e Detalhes Especialmente para Nós</label>
                <textarea required name="descricao" value={formData.descricao} onChange={handleInputChange} placeholder="Conte-nos como quer sua peça... pontos mais abertos, decote, franjas, botões em madeira, alça de couro, etc." rows={5} className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-zinc-50 transition-all font-medium resize-none"></textarea>
              </div>

            </div>
          </div>

          {/* Submission */}
          <div className="flex flex-col items-center mt-6 pt-10 border-t border-zinc-100">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark text-zinc-900 font-bold px-12 py-5 rounded-full flex items-center gap-3 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 text-lg"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Enviar Para Orçamento
                </>
              )}
            </button>
            <p className="text-zinc-500 text-sm mt-4 font-medium max-w-sm text-center">
              Sem compromisso. Enviaremos um orçamento e prazo de confecção para seu WhatsApp em até 48h.
            </p>
          </div>

        </form>
      </section>
    </div>
  );
}
