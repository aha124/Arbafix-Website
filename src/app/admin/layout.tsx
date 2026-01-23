import SessionProvider from "@/components/SessionProvider";

export const metadata = {
  title: "Admin Dashboard - Arbafix",
  description: "Arbafix admin dashboard for managing repair requests",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
