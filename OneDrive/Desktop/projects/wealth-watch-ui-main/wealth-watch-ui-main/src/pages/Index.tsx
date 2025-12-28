
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
