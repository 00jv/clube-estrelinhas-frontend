"use client";

import { use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShoppingBag, Heart, Truck } from "lucide-react";
import { products } from "@/data/mock";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";

export default function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const product = products.find((p) => p.slug === params.slug);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("cru");

  if (!product) {
    return notFound();
  }

  const handleAddToCart = () => {
    addItem(product, 1);
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
                  <Image src={product.image} alt="Thumb" fill className="object-cover" />
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
              <Image src={product.image} alt={product.name} fill className="object-cover object-top" priority />
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
              <div className="flex gap-4">
                {[{id: 'cru', bg: 'bg-zinc-100'}, {id: 'preto', bg: 'bg-zinc-900'}, {id: 'terracota', bg: 'bg-orange-800'}].map((color) => (
                  <button 
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color.id ? 'border-primary p-0.5' : 'border-transparent'}`}
                  >
                    <div className={`w-full h-full rounded-full ${color.bg} shadow-inner bg-clip-content`}></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Tamanho</p>
                <button className="text-[10px] text-zinc-500 underline uppercase tracking-widest font-bold">Guia de Medidas</button>
              </div>
              <div className="flex gap-4">
                {['P', 'M', 'G', 'GG'].map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-full border-2 font-medium flex items-center justify-center transition-colors ${
                      selectedSize === size ? 'border-primary bg-primary/10 text-primary-dark font-bold' : 'border-zinc-200 text-zinc-600 hover:border-zinc-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

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
                src={product.image} 
                alt={`Detalhe feito a mão de ${product.name}`} 
                fill 
                className="object-contain p-8 drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
