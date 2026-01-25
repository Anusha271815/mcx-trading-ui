import "./globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/header/TopBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[var(--bg-app)] text-[var(--text-primary)]">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <TopBar />
            <div className="p-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
