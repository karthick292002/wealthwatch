
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Budget, Transaction } from '@/utils/types';
import { getCategoryById } from '@/utils/mockData';

interface BudgetComparisonChartProps {
  budgets: Budget[];
  transactions: Transaction[];
}

const BudgetComparisonChart = ({ budgets, transactions }: BudgetComparisonChartProps) => {
  const chartData = useMemo(() => {
    // Get the current month in YYYY-MM format
    const currentMonth = new Date().toISOString().substring(0, 7);
    
    // Filter budgets for current month
    const currentBudgets = budgets.filter(budget => budget.month === currentMonth);
    
    // Calculate actual spending per category for current month
    const categorySpending: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .forEach(transaction => {
        const category = transaction.category || 'other';
        if (!categorySpending[category]) {
          categorySpending[category] = 0;
        }
        categorySpending[category] += transaction.amount;
      });
    
    // Create data array for chart
    return currentBudgets.map(budget => {
      const category = getCategoryById(budget.category);
      const actual = categorySpending[budget.category] || 0;
      
      return {
        name: category.name,
        budget: budget.amount,
        actual: actual,
        remaining: Math.max(0, budget.amount - actual),
        overspent: Math.max(0, actual - budget.amount),
        color: category.color
      };
    }).sort((a, b) => b.budget - a.budget);
  }, [budgets, transactions]);

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
      <CardHeader>
        <CardTitle className="text-xl">Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill="#3b82f6" />
                <Bar dataKey="actual" name="Actual" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No budget data available to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetComparisonChart;
