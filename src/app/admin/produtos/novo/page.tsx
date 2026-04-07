"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { Image as ImageIcon, CheckCircle2 } from "lucide-react";

export default function AddProductAdmin() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    category: "Acessórios",
    tag: "",
    description: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "name") {
      const autoSlug = value.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '');
      setFormData(prev => ({ ...prev, name: value, slug: autoSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setImagePreview(null);
    setFormData({
      name: "",
      slug: "",
      price: "",
      category: "Acessórios",
      tag: "",
      description: "",
    });
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Adicionar Novo Produto</h1>
        <p className="text-zinc-500 mt-2">Crie listagens fantásticas para as suas novas peças artesanais.</p>
      </div>

      {isSubmitted ? (
         <div className="bg-white rounded-3xl p-12 shadow-sm border border-zinc-200 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500 min-h-[400px]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-zinc-900 mb-4">Produto Salvo com Sucesso!</h2>
            <p className="text-zinc-600 mb-8 max-w-md">O produto foi cadastrado e (virtualmente) publicado na sua loja. Seus clientes já podem visualizá-lo.</p>
            <div className="flex gap-4">
              <button onClick={resetForm} className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 py-3 rounded-xl transition-colors">
                Adicionar Outro
              </button>
              <Link href="/admin/produtos" className="border border-zinc-300 hover:bg-zinc-50 text-zinc-900 font-bold px-8 py-3 rounded-xl transition-colors">
                Ver Produtos
              </Link>
            </div>
         </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-zinc-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-1">
              <label className="text-sm font-bold text-zinc-900 uppercase tracking-widest block mb-4">Imagem do Produto</label>
              <div className="relative aspect-[4/5] w-full border-2 border-dashed border-zinc-300 hover:border-primary bg-zinc-50 rounded-2xl overflow-hidden transition-all group">
                <input type="file" required accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                       <ImageIcon className="w-8 h-8 text-zinc-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="font-bold text-zinc-700 text-sm">Clique para fazer upload</p>
                    <p className="text-xs text-zinc-400 mt-1">Imagens (PNG) funcionam melhor em fundos coloridos.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">Nome da Peça</label>
                   <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Bolsa Verão Amarela" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">URL Amigável (Slug)</label>
                   <input required type="text" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="bolsa-verao-amarela" className="border border-zinc-200 rounded-xl px-4 py-3 bg-zinc-100 text-zinc-500 cursor-not-allowed font-mono text-sm" readOnly />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">Preço (R$)</label>
                   <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleInputChange} placeholder="Ex: 199.90" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">Categoria Primária</label>
                   <select required name="category" value={formData.category} onChange={handleInputChange} className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium appearance-none">
                      <option value="Acessórios">Acessórios</option>
                      <option value="Vestuário">Vestuário</option>
                      <option value="Moda Praia">Moda Praia</option>
                   </select>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">Tag de Destaque (Opcional)</label>
                 <input type="text" name="tag" value={formData.tag} onChange={handleInputChange} placeholder="Ex: NOVO, Esgotando, Promoção" className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium" />
              </div>

              <div className="flex flex-col gap-2">
                 <label className="text-xs font-bold text-zinc-900 uppercase tracking-widest text-zinc-500">Descrição Detalhada do Produto</label>
                 <textarea required name="description" value={formData.description} onChange={handleInputChange} placeholder="Fale sobre os fios usados, medidas exatas, como a peça veste, o tempo de fabricação, etc." rows={6} className="border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-white transition-all font-medium resize-none"></textarea>
              </div>

            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-zinc-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark text-zinc-900 font-bold px-10 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors uppercase tracking-widest text-sm min-w-[200px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Publicar Produto"
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
