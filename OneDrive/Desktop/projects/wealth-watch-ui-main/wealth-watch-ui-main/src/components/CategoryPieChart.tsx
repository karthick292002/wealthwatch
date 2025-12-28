
import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Transaction } from '@/utils/types';
import { getCategoryById } from '@/utils/mockData';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

const CategoryPieChart = ({ transactions }: CategoryPieChartProps) => {
  const chartData = useMemo(() => {
    // Only consider expense transactions
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const categoryMap: Record<string, number> = {};
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'other';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += transaction.amount;
    });
    
    // Convert to array for the chart
    return Object.entries(categoryMap).map(([categoryId, value]) => {
      const category = getCategoryById(categoryId);
      return {
        name: category.name,
        value,
        color: category.color,
        id: categoryId
      };
    }).sort((a, b) => b.value - a.value);
  }, [transactions]);

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
        <CardTitle className="text-xl">Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No expense data available to display
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
