"use client";

import { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, Product } from "@/lib/api";
import { ShoppingBag, Heart, Truck, X, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

function resolveImageUrl(image: string): string {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`;
  return image;
}

export default function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState("36");
  const [selectedColor, setSelectedColor] = useState("cru");
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [customColor, setCustomColor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (params.slug) {
      getProductBySlug(params.slug)
        .then(setProduct)
        .catch(() => setProduct(null))
        .finally(() => setIsLoading(false));
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-zinc-300 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const isClothing = !product.category.toLowerCase().includes('acessório') && !product.name.toLowerCase().includes('bolsa');

  const handleAddToCart = () => {
    addItem(product as any, 1);
  };

  return (
    <div className="w-full bg-white pb-32 pt-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-xs text-zinc-400 font-semibold tracking-widest uppercase mb-8">
          Início / {product.category} / <span className="text-zinc-900">{product.name}</span>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Gallery Column */}
          <div className="flex gap-4 h-[600px] lg:h-[800px]">
            {/* Thumbnails */}
            <div className="w-20 hidden md:flex flex-col gap-4">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className={`relative w-20 h-24 bg-zinc-100 rounded-lg overflow-hidden cursor-pointer border-2 ${idx === 0 ? 'border-primary' : 'border-transparent'}`}>
                  <Image src={resolveImageUrl(product.image)} alt="Thumb" fill unoptimized className="object-cover" />
                </div>
              ))}
            </div>
            {/* Main Image */}
            <div className="relative flex-1 bg-zinc-50 rounded-2xl overflow-hidden">
               {product.tag && (
                <span className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md text-zinc-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow">
                  {product.tag}
                </span>
              )}
              <Image src={resolveImageUrl(product.image)} alt={product.name} fill unoptimized className="object-cover object-top" priority />
            </div>
          </div>

          {/* Info Column */}
          <div className="flex flex-col py-4 mt-8 lg:mt-0">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-zinc-900 leading-[1.1] mb-4">
              {product.name}
            </h1>
            <p className="text-3xl text-zinc-800 font-medium mb-8">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
            </p>

            <div className="w-full h-px bg-zinc-200 mb-8" />

            {/* Colors */}
            <div className="mb-8">
              <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest mb-4">Cores Disponíveis</p>
              <div className="flex flex-wrap gap-4 items-center">
                {[{id: 'cru', bg: 'bg-zinc-100'}, {id: 'preto', bg: 'bg-zinc-900'}, {id: 'terracota', bg: 'bg-orange-800'}].map((color) => (
                  <button 
                    key={color.id}
                    onClick={() => { setSelectedColor(color.id); setIsCustomColor(false); }}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex-shrink-0 ${!isCustomColor && selectedColor === color.id ? 'border-primary p-0.5' : 'border-transparent'}`}
                    title={color.id}
                  >
                    <div className={`w-full h-full rounded-full ${color.bg} shadow-inner bg-clip-content`}></div>
                  </button>
                ))}
                
                <button
                  onClick={() => setIsCustomColor(true)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border-2 transition-all ${isCustomColor ? 'border-primary text-primary-dark bg-primary/10' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'}`}
                >
                  Cor Personalizada
                </button>
              </div>

              {isCustomColor && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-4">
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="Especifique a cor desejada"
                    className="w-full border border-zinc-200 rounded-lg px-4 py-3 bg-zinc-50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-all"
                  />
                  <p className="text-xs text-zinc-500 mt-2 font-medium">Entraremos em contato para confirmar a disponibilidade da cor.</p>
                </div>
              )}
            </div>

            {/* Sizes */}
            {isClothing && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Tamanho</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-[10px] text-zinc-500 hover:text-zinc-900 underline uppercase tracking-widest font-bold transition-colors"
                  >
                    Guia de Medidas
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['36', '38', '40', '42', '44', '46', '48'].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex-shrink-0 rounded-full border-2 font-medium flex items-center justify-center transition-colors ${
                        selectedSize === size ? 'border-primary bg-primary/10 text-primary-dark font-bold' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary-dark text-zinc-900 font-bold py-5 rounded-full flex items-center justify-center gap-3 transition-colors shadow-lg shadow-primary/20 uppercase tracking-widest text-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                Adicionar ao Carrinho
              </button>
              <button className="w-full sm:w-auto px-8 py-5 rounded-full border border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50 flex items-center justify-center gap-2 text-zinc-700 font-bold transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Freight */}
            <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-zinc-800 font-bold uppercase tracking-widest text-sm">
                <Truck className="w-5 h-5" />
                <p>Calcular Frete e Prazos</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <input 
                  type="text" 
                  placeholder="Seu CEP (00000-000)" 
                  className="flex-1 border border-zinc-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 font-mono text-sm"
                />
                <button className="bg-zinc-900 text-white font-bold px-8 py-3 rounded-lg hover:bg-zinc-800 transition-colors uppercase tracking-widest text-xs">
                  Calcular
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Details Section */}
        <div className="mt-32 pt-24 border-t border-zinc-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="font-serif text-4xl lg:text-6xl font-bold text-zinc-900 tracking-tighter">Feito com Amor</h2>
              <p className="text-zinc-500 leading-relaxed text-lg">
                {product.description} Nossas artesãs dedicam em média 15 horas na confecção manual dessa peça, selecionando fio a fio para garantir um caimento estruturado e confortável.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <span className="bg-zinc-100/50 border border-zinc-100 text-zinc-600 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">#ARTESANAL</span>
                <span className="bg-zinc-100/50 border border-zinc-100 text-zinc-600 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">#SUSTENTÁVEL</span>
              </div>
            </div>
            
            <div className="relative aspect-square w-full max-w-sm ml-auto bg-zinc-100 rounded-[2rem] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500 shadow-xl">
              <Image 
                src={resolveImageUrl(product.image)} 
                alt={`Detalhe feito a mão de ${product.name}`} 
                fill 
                unoptimized
                className="object-contain p-8 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Modal Guia de Medidas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100">
              <h2 className="text-2xl font-serif font-bold text-zinc-900">Tabela de Medidas Feminina</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-zinc-50/50">
                      <th className="px-4 py-3 font-bold text-primary-dark border-b border-zinc-200">Manequim</th>
                      <th className="px-4 py-3 font-bold text-zinc-900 border-b border-zinc-200 text-center">36</th>
                      <th className="px-4 py-3 font-bold text-zinc-900 border-b border-zinc-200 text-center">38</th>
                      <th className="px-4 py-3 font-bold text-zinc-900 border-b border-zinc-200 text-center">40</th>
                      <th className="px-4 py-3 font-bold text-zinc-900 border-b border-zinc-200 text-center">42</th>
                      <th className="px-4 py-3 font-bold text-zinc-900 border-b border-zinc-200 text-center">44</th>
                      <th className="px-4 py-3 font-bold text-zinc-900 border-b border-zinc-200 text-center">46</th>
                      <th className="px-4 py-3 font-bold text-zinc-900 border-b border-zinc-200 text-center">48</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {[
                      { name: 'Tórax', sizes: ['78', '82', '86', '90', '94', '98', '102'] },
                      { name: 'Busto', sizes: ['82', '86', '90', '94', '98', '102', '106'] },
                      { name: 'Cintura', sizes: ['66', '70', '74', '78', '82', '86', '90'] },
                      { name: 'Comp.Blusa Frente', sizes: ['43', '44', '45', '45', '46', '46', '47'] },
                      { name: 'Ombro', sizes: ['11', '11,5', '12', '12,5', '13', '13,4', '13,5'] },
                      { name: 'Altura do Busto', sizes: ['24,8', '25,6', '26,4', '27,2', '28', '28,8', '28,8'] },
                      { name: 'Separação do Busto', sizes: ['17', '18', '18', '19', '20', '21', '22'] },
                      { name: 'Quadris', sizes: ['88', '92', '96', '100', '104', '108', '112'] },
                      { name: 'Largura do Braço', sizes: ['26', '26', '27', '28', '30', '32', '34'] },
                      { name: 'Altura do Quadril', sizes: ['17,5', '18', '18,5', '19', '19,5', '20', '20,5'] },
                      { name: 'Largura das Costas', sizes: ['34', '35', '36', '37', '38', '39', '39'] },
                      { name: 'Altura do Gancho', sizes: ['25', '25,5', '26', '26', '27', '29', '30'] },
                      { name: 'Altura do Joelho', sizes: ['55', '56', '57', '58', '59', '60', '61'] },
                      { name: 'Largura do Joelho', sizes: ['35', '36', '37', '38', '39', '40', '41'] }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-zinc-600 border-r border-zinc-100">{row.name}</td>
                        {row.sizes.map((size, i) => (
                          <td key={i} className="px-4 py-3 text-center text-zinc-700">{size}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
