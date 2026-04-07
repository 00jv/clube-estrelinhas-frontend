"use client";

import { useEffect, useRef } from 'react';
import { Star, Quote } from 'lucide-react';

export default function ReviewsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        
        // Se chegou ao fim do scroll (margem de erro de 10px)
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // O scroll vai percorrer o tamanho de 1 cartão + gap
          const firstChild = carouselRef.current.children[0] as HTMLElement;
          const cardWidth = firstChild?.clientWidth || 400;
          const gap = 24; // relativo ao gap-6 do tailwind (1.5rem)
          carouselRef.current.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        }
      }
    }, 3500); // A cada 3.5 segundos o carrossel anda

    return () => clearInterval(scrollInterval);
  }, []);

  const reviews = [
    {
      name: "Camila Rodrigues",
      text: "A qualidade do fio é impecável! Recebi minha bolsa hoje e estou apaixonada. A embalagem é um capricho só, nota-se o carinho.",
      produto: "Bolsa Artesanal Solar"
    },
    {
      name: "Laura Marques",
      text: "Comprei o Top para usar numa viagem de praia e o caimento ficou perfeito. É nítido que o crochê foi feito com as medidas que passei.",
      produto: "Top Crochê Natural"
    },
    {
      name: "Isabela Fontes",
      text: "Uma verdadeira obra de arte. As cores ao vivo são ainda mais vibrantes e a peça é super confortável, não pinica nada. Recomendo muito!",
      produto: "Vestido Premium Marés"
    },
    {
      name: "Sofia Almeida",
      text: "Fui super bem atendida na sessão de 'Sob Encomenda'. Elas entenderam exatamente a paleta que eu queria para a minha bolsa. Incrível.",
      produto: "Bolsa Sob Encomenda"
    }
  ];

  return (
    <section className="w-full py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">O que elas dizem</h2>
          <p className="text-zinc-500 mt-4 max-w-xl mx-auto">
            Nossas clientes compartilham a experiência de receber uma peça única feita à mão.
          </p>
        </div>

        <div 
          ref={carouselRef}
          className="w-full max-w-6xl flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 pt-4 px-4 sm:px-8 scroll-smooth"
        >
          {reviews.map((review, i) => (
            <div key={i} className="min-w-[300px] sm:min-w-[400px] snap-center bg-zinc-50 p-8 rounded-3xl border border-zinc-100 flex-shrink-0 relative shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <Quote className="absolute top-6 right-8 w-12 h-12 text-primary/20" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-5 h-5 fill-primary text-primary" />)}
              </div>
              <p className="text-zinc-700 italic mb-8 relative z-10 leading-relaxed font-serif text-lg">
                "{review.text}"
              </p>
              <div className="border-t border-zinc-200 pt-4 mt-auto">
                <h4 className="font-bold text-zinc-900">{review.name}</h4>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">Produto: {review.produto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
