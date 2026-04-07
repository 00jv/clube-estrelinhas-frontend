"use client";

import { CreditCard, DollarSign, Package, TrendingUp, Users } from "lucide-react";
import { products } from "@/data/mock";

export default function AdminDashboard() {
  const totalProducts = products.length;
  
  // Dummy data for visual metrics
  const stats = [
    { name: "Receita (Mês)", value: "R$ 4.850,00", icon: DollarSign, change: "+12%" },
    { name: "Vendas", value: "32", icon: CreditCard, change: "+5%" },
    { name: "Visitas na Loja", value: "1,240", icon: Users, change: "+18%" },
    { name: "Produtos Ativos", value: totalProducts, icon: Package, change: "0%" },
  ];

  const recentOrders = [
    { id: "#1023", customer: "Maria Silva", product: "Bolsa Artesanal Solar", total: "R$ 389,00", status: "Em Produção", date: "Hoje" },
    { id: "#1022", customer: "Ana Julia", product: "Top Crochê Natural", total: "R$ 199,90", status: "Pronto para Envio", date: "Ontem" },
    { id: "#1021", customer: "Fernanda Costa", product: "Vestido Premium Marés", total: "R$ 659,00", status: "Enviado", date: "03 Abr" },
    { id: "#1020", customer: "Juliana Santos", product: "Bolsa Encanto Brisa", total: "R$ 499,00", status: "Entregue", date: "01 Abr" },
  ];

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900">Visão Geral</h1>
        <p className="text-zinc-500 mt-2">Acompanhe as métricas e últimos pedidos da sua loja.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center text-zinc-600">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-zinc-500 font-medium text-sm mb-1">{stat.name}</h3>
            <p className="text-3xl font-serif font-bold text-zinc-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Box */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
            <h2 className="text-xl font-bold font-serif text-zinc-900">Últimos Pedidos Recebidos</h2>
            <button className="text-sm text-primary-dark font-bold hover:underline">Ver Todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-zinc-50/50 text-xs uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4">Pedido</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Peça Principal</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-zinc-900">{order.id}</td>
                    <td className="px-6 py-4 text-zinc-700">{order.customer}</td>
                    <td className="px-6 py-4 text-zinc-700">{order.product}</td>
                    <td className="px-6 py-4 font-medium text-zinc-900">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        order.status === "Em Produção" ? "bg-amber-100 text-amber-700" :
                        order.status === "Pronto para Envio" ? "bg-blue-100 text-blue-700" :
                        order.status === "Entregue" ? "bg-green-100 text-green-700" :
                        "bg-zinc-100 text-zinc-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-zinc-900 rounded-3xl p-8 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-primary/10">
            <TrendingUp className="w-48 h-48" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-4 relative z-10">E-commerce no ar!</h2>
          <p className="text-zinc-400 mb-8 relative z-10">
            Você está vendo o painel administrativo da Clube Estrelinhas. Lembre-se de manter seus produtos sempre atualizados para oferecer a melhor experiência.
          </p>
          <button className="bg-primary hover:bg-primary-dark text-zinc-900 font-bold py-3 rounded-xl transition-colors relative z-10">
            Acessar Ajuda e Dicas
          </button>
        </div>
      </div>
    </div>
  );
}
