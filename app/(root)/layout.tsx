import Header from "@/components/shared/Header";
import Gallery from "@/components/shared/Gallery";
import Footer from "@/components/shared/Footer";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <Header />
      <Gallery />
      <main className="flex flex-col flex-1 justify-center items-center bg-orange-50">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}
