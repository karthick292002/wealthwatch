
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Transaction, TransactionFormData, Budget } from '@/utils/types';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import MonthlyExpensesChart from './MonthlyExpensesChart';
import CategoryPieChart from './CategoryPieChart';
import BudgetManagement from './BudgetManagement';
import BudgetComparisonChart from './BudgetComparisonChart';
import SpendingInsights from './SpendingInsights';
import { mockTransactions, mockBudgets, categories } from '@/utils/mockData';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleAddTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      ...data,
      id: Date.now().toString()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
    setIsAddDialogOpen(false);
    
    toast({
      title: "Transaction added",
      description: "The transaction has been added successfully."
    });
  };
  
  const handleEditTransaction = (data: TransactionFormData) => {
    if (!editingTransaction) return;
    
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === editingTransaction.id 
          ? { ...transaction, ...data }
          : transaction
      )
    );
    
    setEditingTransaction(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Transaction updated",
      description: "The transaction has been updated successfully."
    });
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed."
    });
  };
  
  // Calculate summary statistics
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <span className="text-sm text-slate-500 mb-1">Total Income</span>
          <span className="text-2xl font-semibold text-green-600">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(totalIncome)}
          </span>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <span className="text-sm text-slate-500 mb-1">Total Expenses</span>
          <span className="text-2xl font-semibold text-red-500">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(totalExpenses)}
          </span>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 flex flex-col">
          <span className="text-sm text-slate-500 mb-1">Balance</span>
          <span className={`text-2xl font-semibold ${balance >= 0 ? 'text-blue-600' : 'text-red-500'}`}>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(balance)}
          </span>
        </div>
      </div>

      {/* Spending Insights */}
      <SpendingInsights transactions={transactions} budgets={budgets} />

      {/* Charts and Budgets Tabs */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-4">
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MonthlyExpensesChart transactions={transactions} />
            <CategoryPieChart transactions={transactions} />
          </div>
          <BudgetComparisonChart budgets={budgets} transactions={transactions} />
        </TabsContent>
        
        <TabsContent value="budgets">
          <BudgetManagement 
            budgets={budgets} 
            setBudgets={setBudgets} 
            transactions={transactions} 
          />
        </TabsContent>
      </Tabs>

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-medium">Recent Transactions</h2>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <TransactionForm 
                onSubmit={handleAddTransaction} 
                onCancel={() => setIsAddDialogOpen(false)}
                categories={categories}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <TransactionList 
          transactions={transactions}
          onEdit={(transaction) => {
            setEditingTransaction(transaction);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteTransaction}
          categories={categories}
        />
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            {editingTransaction && (
              <TransactionForm 
                initialData={editingTransaction}
                onSubmit={handleEditTransaction}
                onCancel={() => {
                  setEditingTransaction(null);
                  setIsEditDialogOpen(false);
                }}
                categories={categories}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
