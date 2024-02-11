import Header from "@/components/shared/Header";
import ImageGallery from "@/components/shared/ImageGallery";
import Footer from "@/components/shared/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen p-5">
      <Header />
      <ImageGallery />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
