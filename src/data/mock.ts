export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  tag?: string;
  category: string;
  description: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Bolsa Artesanal Solar",
    slug: "bolsa-artesanal-solar",
    price: 389.00,
    image: "/bolsa1SemFundo.png",
    tag: "NOVO",
    category: "Acessórios",
    description: "Bolsa de crochê com acabamento impecável, 100% manual e sustentável. Ideal para dias ensolarados e compor looks leves e elegantes."
  },
  {
    id: "2",
    name: "Top Crochê Natural",
    slug: "top-croche-natural",
    price: 199.90,
    image: "/croppedSemFundo.png",
    tag: "DESTAQUE",
    category: "Vestuário",
    description: "Top feito em fio de algodão orgânico, perfeito para o verão com trama exclusiva que não agride o meio ambiente."
  },
  {
    id: "3",
    name: "Vestido Premium Marés",
    slug: "vestido-premium-mares",
    price: 659.00,
    image: "/vestidoSemFundo.png",
    tag: "PREMIUM",
    category: "Moda Praia",
    description: "Uma obra de arte em formato de vestido. O modelo Marés traz exclusividade, conforto e elegância em fios selecionados."
  },
  {
    id: "4",
    name: "Bolsa Encanto Brisa",
    slug: "bolsa-encanto-brisa",
    price: 499.00,
    image: "/bolsa2SemFundo.png",
    category: "Acessórios",
    description: "Bolsa exclusiva em crochê para momentos inesquecíveis, trazendo sofisticação e estilo feito à mão."
  }
];
