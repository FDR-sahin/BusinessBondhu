import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

/** Public shell: sticky header, content, footer, mobile bottom nav. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
