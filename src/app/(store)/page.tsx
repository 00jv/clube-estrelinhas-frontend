import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ReviewsCarousel from '@/components/ReviewsCarousel';
import { getProducts } from '@/lib/api';

export default async function Home() {
  const products = await getProducts().catch(() => []);
  return (
    <div className="w-full flex-col flex items-center">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/CardPrincipal.png"
            alt="Textura de crochê principal"
            fill
            className="object-cover object-left md:object-center opacity-90 scale-105"
            priority
          />
          {/* Ambient Gradient Overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-50/60 via-zinc-50/20 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl flex flex-col items-start gap-6">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase bg-primary/10 px-4 py-1.5 rounded-full inline-block">
              Nova Coleção 2026
            </span>
            <h1 className="font-serif text-6xl md:text-8xl font-bold tracking-tighter text-zinc-900 leading-[0.9]">
              A Arte do<br />Fio Manual
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 max-w-md font-medium leading-relaxed">
              Descubra a elegância atemporal do crochê. Peças exclusivas, feitas a mão com amor e sustentabilidade para você.
            </p>
            <div className="mt-4">
              <Link
                href="#destaques"
                className="group bg-primary hover:bg-primary-dark text-zinc-900 font-bold px-8 py-5 rounded-full flex items-center gap-3 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1"
              >
                Descubra a Nova Coleção
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques do Crochê */}
      <section id="destaques" className="w-full py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center mb-16 gap-4">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900">Destaques da Temporada</h2>
            <p className="text-zinc-500 max-w-xl">
              Nossas criações mais amadas, que unem design contemporâneo e técnicas milenares.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Sustentabilidade */}
      <section className="w-full py-24 bg-zinc-50 overflow-hidden relative">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16 md:gap-24 relative z-10">

          {/* Asymmetric Image */}
          <div className="w-full md:w-1/2 relative flex justify-center py-10">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl transform -translate-x-10"></div>
            <div className="relative w-full max-w-sm aspect-[4/5] -rotate-3 transition-transform hover:rotate-0 duration-700 bg-white p-4 shadow-2xl rounded-sm">
              <div className="relative w-full h-full overflow-hidden bg-zinc-200">
                <Image
                  src="/bolsa3SemFundo.png"
                  alt="Sustentabilidade"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Small floating detail */}
            <div className="absolute bottom-4 right-0 md:-right-8 bg-white p-6 rounded-2xl shadow-xl w-48 rotate-6 border border-zinc-100">
              <p className="font-serif font-bold text-xl text-zinc-900">100%</p>
              <p className="text-sm text-zinc-500 mt-1">Feito Manualmente</p>
            </div>
          </div>

          {/* Text Block */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-8">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
              Sustentabilidade em<br />cada ponto.
            </h2>
            <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-xl text-zinc-600 font-serif">
              "Na contramão da produção em massa, valorizamos o tempo. Cada peça conta uma história de cuidado ecológico e humano."
            </blockquote>

            <div className="grid grid-cols-2 gap-6 w-full mt-4">
              <div className="flex flex-col gap-2">
                <div className="w-12 h-1 bg-zinc-200 rounded-full mb-2"></div>
                <h4 className="font-bold text-zinc-900">0% Plástico</h4>
                <p className="text-sm text-zinc-500">Embalagens ecológicas e botões naturais.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-12 h-1 bg-zinc-200 rounded-full mb-2"></div>
                <h4 className="font-bold text-zinc-900">Slow Fashion</h4>
                <p className="text-sm text-zinc-500">Produção ética sem excessos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ReviewsCarousel />

      {/* Newsletter / CTA */}
      <section className="w-full py-32 bg-zinc-900 text-white flex justify-center border-t-8 border-primary">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-8 max-w-3xl">
          <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tight">Pronta para viver essa experiência?</h2>
          <p className="text-zinc-400 text-lg md:text-xl">
            Junte-se ao nosso clube. Receba novidades, coleções exclusivas e dicas de moda artesanal no seu e-mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
            <Link
              href="/checkout"
              className="bg-primary hover:bg-primary-dark text-zinc-900 font-bold px-10 py-5 rounded-full transition-colors shadow-lg shadow-primary/20 flex items-center justify-center whitespace-nowrap"
            >
              Comprar Agora
            </Link>
            <Link
              href="#"
              className="bg-transparent border-2 border-zinc-700 hover:border-zinc-400 text-white font-bold px-10 py-5 rounded-full transition-colors flex items-center justify-center whitespace-nowrap"
            >
              Fale com um Especialista
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
