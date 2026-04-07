"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PackagePlus, LogOut, Package, Settings, ArrowLeft } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produtos", label: "Seus Produtos", icon: Package },
    { href: "/admin/produtos/novo", label: "Adicionar Produto", icon: PackagePlus },
    { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-zinc-900 flex-shrink-0 text-white flex flex-col hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-zinc-800">
          <span className="font-serif text-xl font-bold tracking-tight">Estrelinhas Admin</span>
        </div>
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary/20 text-primary-dark font-medium"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" /> {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-zinc-800 rounded-xl transition-colors">
            <LogOut className="w-5 h-5" /> Sair da Loja
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="h-20 bg-white border-b border-zinc-200 flex items-center px-6 md:hidden flex-shrink-0">
          <Link href="/" className="flex items-center text-sm font-bold tracking-widest uppercase text-zinc-500 hover:text-zinc-900 border border-zinc-200 px-4 py-2 rounded-full gap-2">
            <ArrowLeft className="w-4 h-4" /> Loja
          </Link>
          <span className="ml-auto font-serif text-lg font-bold">Menu Admin</span>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
