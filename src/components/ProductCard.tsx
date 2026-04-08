import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

function resolveImageUrl(image: string): string {
  if (image.startsWith('http')) return image;
  // If image is a path like /uploads/... it comes from backend static files
  if (image.startsWith('/uploads/')) return `${API_URL}${image}`;
  // Local public assets from Next.js public folder
  return image;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produto/${product.slug}`} className="group flex flex-col gap-5">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 rounded-2xl">
        <Image
          src={resolveImageUrl(product.image)}
          alt={product.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        {product.tag && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-zinc-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            {product.tag}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 items-start">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">{product.category}</p>
        <h3 className="font-serif text-lg text-zinc-900 group-hover:text-primary transition-colors leading-tight">{product.name}</h3>
        <p className="font-medium text-zinc-500 mt-1">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
        </p>
      </div>
    </Link>
  );
}
