// app/page.tsx - Página principal del dashboard
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Dashboard />
    </main>
  );
}