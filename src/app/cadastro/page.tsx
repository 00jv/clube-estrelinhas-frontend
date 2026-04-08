"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Lock, Phone, MapPin, 
  Ruler, Loader2, ArrowLeft, ArrowRight,
  CheckCircle2, Home, Building2, Hash
} from 'lucide-react';
import { registerUser } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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

  const [isFetchingCep, setIsFetchingCep] = useState(false);

  // Função para buscar CEP
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

  // Função para aplicar máscara de Telefone (00) 00000-0000
  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  // Função para aplicar máscara de CEP (00000-000)
  const maskCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Limpar máscaras antes de enviar para a API (opcional, mas recomendado)
      const cleanData = {
        ...formData,
        phone: formData.phone.replace(/\D/g, ''),
        zipCode: formData.zipCode.replace(/\D/g, ''),
        bust: formData.bust ? parseFloat(formData.bust) : undefined,
        waist: formData.waist ? parseFloat(formData.waist) : undefined,
        hips: formData.hips ? parseFloat(formData.hips) : undefined,
      };

      await registerUser(cleanData);

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-50 font-sans">
        <div className="text-center p-12 bg-white rounded-[40px] shadow-2xl max-w-lg mx-auto animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-zinc-900" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-zinc-900 mb-4 text-balance">Bem-vindo ao Clube!</h1>
          <p className="text-zinc-500 text-lg mb-8 leading-relaxed">
            Seu cadastro foi realizado com sucesso. Estamos te redirecionando para o login...
          </p>
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-white font-sans overflow-hidden">
      <div className="w-full flex flex-col md:flex-row h-full">
        
        {/* Lado Esquerdo - Visual e Steps */}
        <div className="hidden md:flex md:w-5/12 relative h-full bg-zinc-900 overflow-hidden">
          <Image 
            src="/images/login-side.png" 
            alt="Crochê Artesanal - Cadastro" 
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-between p-16">
            <header>
               <Link href="/" className="font-serif text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary rounded-xl"></div>
                 Clube Estrelinhas
               </Link>
            </header>

            <div className="space-y-10">
              <h2 className="font-serif text-5xl font-bold text-white leading-tight">
                Crie sua conta e<br />viva a experiência<br />do sob medida.
              </h2>
              
              {/* Step Progress Visual */}
              <div className="space-y-6">
                <div className={`flex items-center gap-4 transition-all duration-300 ${step >= 1 ? 'opacity-100 translate-x-3' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 1 ? 'border-primary bg-primary text-zinc-900' : 'border-white text-white'}`}>1</div>
                  <span className="text-white font-medium text-lg">Informações Básicas</span>
                </div>
                <div className={`flex items-center gap-4 transition-all duration-300 ${step >= 2 ? 'opacity-100 translate-x-3' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 2 ? 'border-primary bg-primary text-zinc-900' : 'border-white text-white'}`}>2</div>
                  <span className="text-white font-medium text-lg">Contato e Endereço</span>
                </div>
                <div className={`flex items-center gap-4 transition-all duration-300 ${step >= 3 ? 'opacity-100 translate-x-3' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 3 ? 'border-primary bg-primary text-zinc-900' : 'border-white text-white'}`}>3</div>
                  <span className="text-white font-medium text-lg">Suas Medidas (Opcional)</span>
                </div>
              </div>
            </div>

            <p className="text-zinc-400 text-sm max-w-xs italic border-l-2 border-primary/50 pl-4">
              Cada ponto é contado. Cada medida importa para o ajuste perfeito.
            </p>
          </div>
        </div>

        {/* Lado Direito - Multi-step Form */}
        <div className="w-full md:w-7/12 h-full flex items-center justify-center bg-white p-6 md:p-20 overflow-y-auto">
          <div className="max-w-2xl w-full mx-auto py-10">
            
            <header className="mb-12 relative">
               {step > 1 && (
                 <button 
                  onClick={() => setStep(step - 1)}
                  className="absolute -top-12 left-0 text-zinc-400 hover:text-zinc-900 flex items-center gap-2 text-sm font-bold transition-colors"
                 >
                   <ArrowLeft className="w-4 h-4" /> Voltar
                 </button>
               )}
               <h1 className="font-serif text-4xl font-bold text-zinc-900 mb-2">
                 {step === 1 && "Primeiros Passos"}
                 {step === 2 && "Onde Te Encontramos?"}
                 {step === 3 && "O Ajuste Perfeito"}
               </h1>
               <p className="text-zinc-500 font-medium">
                 {step === 1 && "Conte-nos um pouco sobre você."}
                 {step === 2 && "Endereço de entrega e contato (WhatsApp)."}
                 {step === 3 && "Campos opcionais para nos ajudar na criação das suas peças."}
               </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
                  {error}
                </div>
              )}

              {/* STEP 1: DADOS BÁSICOS */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                      <input 
                        required
                        type="text" 
                        placeholder="Como podemos te chamar?"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">E-mail</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                      <input 
                        required
                        type="email" 
                        placeholder="seu@dominio.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Crie uma Senha</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                      <input 
                        required
                        type="password" 
                        placeholder="No mínimo 6 caracteres"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CONTATO E ENDEREÇO */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">WhatsApp / Telefone</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="(00) 00000-0000"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                          className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">CEP</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="00000-000"
                          value={formData.zipCode}
                          onBlur={() => handleZipCodeLookup(formData.zipCode)}
                          onChange={e => {
                            const val = maskCEP(e.target.value);
                            setFormData({ ...formData, zipCode: val });
                            if (val.length === 9) handleZipCodeLookup(val);
                          }}
                          className="w-full pl-12 pr-12 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                        />
                        {isFetchingCep && (
                          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Rua / Logradouro</label>
                    <div className="relative group">
                      <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Nome da avenida, rua..."
                        value={formData.street}
                        onChange={e => setFormData({ ...formData, street: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Número</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        value={formData.number}
                        onChange={e => setFormData({ ...formData, number: e.target.value })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                      />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Complemento</label>
                      <input 
                        type="text" 
                        placeholder="Apto, Bloco..."
                        value={formData.complement}
                        onChange={e => setFormData({ ...formData, complement: e.target.value })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Bairro</label>
                      <input 
                        type="text" 
                        value={formData.neighborhood}
                        onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                        className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Cidade / UF</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={formData.city}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900"
                        />
                        <input 
                          type="text" 
                          placeholder="UF"
                          maxLength={2}
                          value={formData.state}
                          onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                          className="w-20 px-2 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-zinc-900 text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: MEDIDAS CORPORAIS */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="bg-primary/5 border border-primary/20 p-6 rounded-[32px] mb-8">
                     <p className="text-zinc-600 text-sm leading-relaxed text-center">
                       <strong>Dica Estrelinhas:</strong> Como nossas peças são artesanais, saber suas medidas nos ajuda a sugerir o tamanho ideal ou até criar algo exclusivo para você. <span className="italic">(Opcional)</span>
                     </p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-white border border-zinc-100 shadow-sm rounded-xl flex items-center justify-center mx-auto text-primary">
                          <Ruler className="w-6 h-6" />
                        </div>
                        <label className="block text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Busto (cm)</label>
                        <input 
                          type="number" 
                          placeholder="00"
                          value={formData.bust}
                          onChange={e => setFormData({ ...formData, bust: e.target.value })}
                          className="w-full px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-zinc-900 text-center text-xl"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-white border border-zinc-100 shadow-sm rounded-xl flex items-center justify-center mx-auto text-primary">
                          <Ruler className="w-6 h-6 rotate-45" />
                        </div>
                        <label className="block text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Cintura (cm)</label>
                        <input 
                          type="number" 
                          placeholder="00"
                          value={formData.waist}
                          onChange={e => setFormData({ ...formData, waist: e.target.value })}
                          className="w-full px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-zinc-900 text-center text-xl"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-white border border-zinc-100 shadow-sm rounded-xl flex items-center justify-center mx-auto text-primary">
                          <Ruler className="w-6 h-6 -rotate-45" />
                        </div>
                        <label className="block text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Quadril (cm)</label>
                        <input 
                          type="number" 
                          placeholder="00"
                          value={formData.hips}
                          onChange={e => setFormData({ ...formData, hips: e.target.value })}
                          className="w-full px-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-zinc-900 text-center text-xl"
                        />
                      </div>
                   </div>

                   <p className="text-center text-xs text-zinc-400 pt-4">Você também poderá atualizar essas medidas a qualquer momento em seu perfil.</p>
                </div>
              )}

              <button 
                disabled={isLoading}
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-zinc-900 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group text-lg"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {step < 3 ? "CONTINUAR" : "FINALIZAR CADASTRO"}
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <footer className="mt-12 text-center">
              <p className="text-zinc-500 font-medium">
                Já faz parte do clube?{" "}
                <Link href="/login" className="text-primary hover:text-primary-dark font-bold underline underline-offset-4 decoration-2">
                  Faça Login
                </Link>
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
