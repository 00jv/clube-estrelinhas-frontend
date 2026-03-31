import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MiniCart from "@/components/MiniCart";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <MiniCart />
      <main className="flex-1 w-full flex flex-col items-center">
        {children}
      </main>
      <Footer />
    </>
  );
}
