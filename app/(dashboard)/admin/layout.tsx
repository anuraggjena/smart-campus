export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Console</h1>
      <nav style={{ marginBottom: 16 }}>
        <a href="/admin/dashboard">Dashboard</a> |{" "}
        <a href="/admin/analytics">Analytics</a>
      </nav>
      {children}
    </div>
  );
}
