import Footer from "./_Footer";
import SideBar from "./_SideBar";
import "@/mocks";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SideBar />
      {children}
      <Footer />
    </div>
  );
}
