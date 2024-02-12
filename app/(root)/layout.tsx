import Header from "@/components/shared/Header";
import Gallery from "@/components/shared/Gallery";
import Footer from "@/components/shared/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col">
      <Header />
      <Gallery />
      <main className="flex-1 bg-custom-blue px-20">{children}</main>
      <Footer />
    </div>
  );
}
