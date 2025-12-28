
import { FC } from 'react';
import { Wallet, BarChart3, PieChart, Landmark } from 'lucide-react';

const Navigation: FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-blue-600">Wealth Watch</h1>
        </div>
        <nav className="hidden md:flex gap-6 text-slate-600">
          <a href="/" className="flex items-center gap-1.5 hover:text-blue-600">
            <BarChart3 className="h-4 w-4" /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-blue-600">
            <PieChart className="h-4 w-4" /> Reports
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-blue-600">
            <Landmark className="h-4 w-4" /> Budgets
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
