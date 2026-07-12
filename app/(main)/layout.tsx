import Footer from "./_Footer";
import SideBar from "./_SideBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SideBar />
      {children}
      <Footer />
    </div>
  );
}
