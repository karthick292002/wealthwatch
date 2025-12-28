
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from 'lucide-react';
import { Budget, Transaction } from '@/utils/types';
import { categories, getCategoryById } from '@/utils/mockData';
import BudgetForm from './BudgetForm';

interface BudgetManagementProps {
  budgets: Budget[];
  setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
  transactions: Transaction[];
}

const BudgetManagement = ({ budgets, setBudgets, transactions }: BudgetManagementProps) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Get the current month in YYYY-MM format
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  // Calculate total spent per category this month
  const categorySpending: Record<string, number> = {};
  const monthlyTransactions = transactions.filter(t => 
    t.type === 'expense' && t.date.startsWith(currentMonth)
  );
  
  monthlyTransactions.forEach(transaction => {
    const category = transaction.category || 'other';
    if (!categorySpending[category]) {
      categorySpending[category] = 0;
    }
    categorySpending[category] += transaction.amount;
  });

  const handleAddBudget = (newBudget: Budget) => {
    // Check if budget for this category and month already exists
    const existingIndex = budgets.findIndex(
      b => b.category === newBudget.category && b.month === newBudget.month
    );
    
    if (existingIndex >= 0) {
      // Update existing budget
      const updatedBudgets = [...budgets];
      updatedBudgets[existingIndex] = newBudget;
      setBudgets(updatedBudgets);
      
      toast({
        title: "Budget updated",
        description: `Budget for ${getCategoryById(newBudget.category).name} has been updated.`
      });
    } else {
      // Add new budget
      setBudgets([...budgets, newBudget]);
      
      toast({
        title: "Budget added",
        description: `New budget for ${getCategoryById(newBudget.category).name} has been added.`
      });
    }
    
    setIsAddDialogOpen(false);
  };

  const handleEditBudget = (updatedBudget: Budget) => {
    setBudgets(
      budgets.map(budget => 
        budget.category === updatedBudget.category && budget.month === updatedBudget.month
          ? updatedBudget
          : budget
      )
    );
    
    setSelectedBudget(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "Budget updated",
      description: `Budget for ${getCategoryById(updatedBudget.category).name} has been updated.`
    });
  };

  // Filter budgets for current month
  const currentBudgets = budgets.filter(budget => budget.month === currentMonth);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Monthly Budgets</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Budget</DialogTitle>
            </DialogHeader>
            <BudgetForm 
              onSubmit={handleAddBudget} 
              onCancel={() => setIsAddDialogOpen(false)}
              initialMonth={currentMonth}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentBudgets.length > 0 ? (
          currentBudgets.map(budget => {
            const category = getCategoryById(budget.category);
            const spent = categorySpending[budget.category] || 0;
            const percentage = Math.min(Math.round((spent / budget.amount) * 100), 100);
            const isOverBudget = spent > budget.amount;
            
            return (
              <div key={budget.category} className="space-y-1">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{category.name}</span>
                    <span className="ml-2 text-muted-foreground text-sm">
                      {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                    </span>
                  </div>
                  <Dialog open={isEditDialogOpen && selectedBudget?.category === budget.category} onOpenChange={(open) => {
                    if (!open) setSelectedBudget(null);
                    setIsEditDialogOpen(open);
                  }}>
                    <DialogTrigger asChild onClick={() => setSelectedBudget(budget)}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Edit Budget</DialogTitle>
                      </DialogHeader>
                      {selectedBudget && (
                        <BudgetForm 
                          initialData={selectedBudget}
                          onSubmit={handleEditBudget}
                          onCancel={() => {
                            setSelectedBudget(null);
                            setIsEditDialogOpen(false);
                          }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                <Progress 
                  value={percentage} 
                  className={isOverBudget ? "bg-muted h-2" : "h-2"} 
                  indicatorClassName={isOverBudget ? "bg-red-500" : undefined}
                />
                {isOverBudget && (
                  <p className="text-sm text-red-500">
                    Over budget by {formatCurrency(spent - budget.amount)}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No budgets set for this month. Add a budget to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetManagement;
