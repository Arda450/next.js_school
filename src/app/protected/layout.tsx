import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";

// app/authenticated/layout.tsx
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Header />
      </header>
      <div className="flex-grow px-16 py-10">
        <main>{children}</main>
      </div>

      <Footer></Footer>
    </div>
  );
}
