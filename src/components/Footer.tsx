import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div className="flex flex-col gap-4">
          <h3 className="font-serif text-xl font-bold text-zinc-900">Clube Estrelinhas</h3>
          <p className="max-w-xs leading-relaxed text-zinc-500">A Arte do Fio Manual. Transformando fios em peças únicas e exclusivas com sustentabilidade e amor em cada ponto.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-zinc-900 uppercase tracking-widest text-xs">Atendimento</h4>
          <Link href="#" className="hover:text-primary transition-colors text-zinc-500">Sobre Nós</Link>
          <Link href="#" className="hover:text-primary transition-colors text-zinc-500">Políticas de Troca</Link>
          <Link href="#" className="hover:text-primary transition-colors text-zinc-500">Prazos de Entrega</Link>
          <Link href="#" className="hover:text-primary transition-colors text-zinc-500">Fale Conosco</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-zinc-900 uppercase tracking-widest text-xs">Acompanhe</h4>
          <Link href="#" className="hover:text-primary transition-colors text-zinc-500">Instagram</Link>
          <Link href="#" className="hover:text-primary transition-colors text-zinc-500">Pinterest</Link>
          <Link href="#" className="hover:text-primary transition-colors text-zinc-500">TikTok</Link>
        </div>
      </div>
      <div className="mt-12 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} Clube Estrelinhas. Todos os direitos reservados.
      </div>
    </footer>
  );
}
