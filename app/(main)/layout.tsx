import Footer from "./_Footer";
import SideBar from "./_SideBar";
import "@/mocks";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-auto min-h-screen flex-col">
      <SideBar />
      {children}
      <Footer />
    </div>
  );
}
