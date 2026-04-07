import { use } from "react";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/mock";

const categoryMap: Record<string, string> = {
  "acessorios": "Acessórios",
  "vestuario": "Vestuário",
  "moda-praia": "Moda Praia"
};

const categoryDescriptions: Record<string, string> = {
  "acessorios": "Complete seu look com bolsas e peças exclusivas feitas à mão.",
  "vestuario": "Roupas com caimento perfeito, unindo conforto e técnicas milenares do crochê.",
  "moda-praia": "Viva o frescor do litoral com peças em trama macia que abraçam o corpo com elegância."
};

export default function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params);
  const slug = params.slug;

  const categoryTitle = categoryMap[slug];

  if (!categoryTitle) {
    return notFound();
  }

  // Filtrar os produtos da categoria
  const categoryProducts = products.filter(
    (product) => product.category === categoryTitle
  );

  return (
    <div className="w-full pb-32">
      {/* Banner da Categoria */}
      <section className="w-full bg-zinc-50 py-20 mb-16 border-b border-zinc-100 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-zinc-900 mb-6 tracking-tight">
          {categoryTitle}
        </h1>
        <p className="text-zinc-500 max-w-xl text-lg relative">
          <span className="absolute -left-6 top-0 text-3xl text-primary/30 font-serif">"</span>
          {categoryDescriptions[slug]}
          <span className="absolute -right-6 bottom-0 text-3xl text-primary/30 font-serif">"</span>
        </p>
      </section>

      {/* Lista de Produtos */}
      <div className="container mx-auto px-4">
        <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-10 flex items-center gap-2">
          {categoryProducts.length} {categoryProducts.length === 1 ? 'Produto Encontrado' : 'Produtos Encontrados'}
          <div className="flex-1 h-px bg-zinc-100 ml-4"></div>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-zinc-300 text-4xl font-serif">?</span>
            </div>
            <h2 className="text-2xl font-bold font-serif text-zinc-900 mb-2">Coleção em Desenvolvimento</h2>
            <p className="text-zinc-500">No momento não temos peças ativas nessa categoria, mas nossas artesãs estão criando novidades.</p>
          </div>
        )}
      </div>
    </div>
  );
}
