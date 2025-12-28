
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Transaction, Budget } from '@/utils/types';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { getCategoryById } from '@/utils/mockData';

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const SpendingInsights = ({ transactions, budgets }: SpendingInsightsProps) => {
  const insights = useMemo(() => {
    // Get current and previous month
    const now = new Date();
    const currentMonth = now.toISOString().substring(0, 7);
    
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const prevMonthStr = prevMonth.toISOString().substring(0, 7);
    
    // Filter transactions by month
    const currentMonthTransactions = transactions.filter(t => 
      t.date.startsWith(currentMonth) && t.type === 'expense'
    );
    
    const prevMonthTransactions = transactions.filter(t => 
      t.date.startsWith(prevMonthStr) && t.type === 'expense'
    );
    
    // Calculate total spending for current and previous month
    const currentTotal = currentMonthTransactions.reduce((total, t) => total + t.amount, 0);
    const prevTotal = prevMonthTransactions.reduce((total, t) => total + t.amount, 0);
    
    // Find largest category spending
    const categorySpending: Record<string, number> = {};
    
    currentMonthTransactions.forEach(t => {
      const category = t.category || 'other';
      if (!categorySpending[category]) categorySpending[category] = 0;
      categorySpending[category] += t.amount;
    });
    
    let largestCategory = { id: '', amount: 0 };
    
    Object.entries(categorySpending).forEach(([category, amount]) => {
      if (amount > largestCategory.amount) {
        largestCategory = { id: category, amount };
      }
    });
    
    // Find most over-budget category
    const currentBudgets = budgets.filter(b => b.month === currentMonth);
    let mostOverBudget = { id: '', amount: 0, percentage: 0 };
    
    currentBudgets.forEach(budget => {
      const spent = categorySpending[budget.category] || 0;
      const overAmount = spent - budget.amount;
      const overPercentage = budget.amount > 0 ? (spent / budget.amount) : 0;
      
      if (overAmount > 0 && overPercentage > mostOverBudget.percentage) {
        mostOverBudget = {
          id: budget.category,
          amount: overAmount,
          percentage: overPercentage
        };
      }
    });
    
    // Calculate spending trend
    let trend = 0;
    if (prevTotal > 0) {
      trend = ((currentTotal - prevTotal) / prevTotal) * 100;
    }
    
    // Calculate number of days with spending
    const uniqueDaysWithSpending = new Set(
      currentMonthTransactions.map(t => t.date.substring(0, 10))
    ).size;
    
    // Calculate total budget and remaining budget
    const totalBudget = currentBudgets.reduce((sum, b) => sum + b.amount, 0);
    const remainingBudget = totalBudget - currentTotal;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - now.getDate() + 1;
    
    return {
      currentTotal,
      prevTotal,
      trend,
      largestCategory: largestCategory.id ? getCategoryById(largestCategory.id) : null,
      largestCategoryAmount: largestCategory.amount,
      mostOverBudget: mostOverBudget.id ? getCategoryById(mostOverBudget.id) : null,
      mostOverBudgetAmount: mostOverBudget.amount,
      uniqueDaysWithSpending,
      totalBudget,
      remainingBudget,
      daysRemaining,
      dailyBudget: remainingBudget > 0 && daysRemaining > 0 ? remainingBudget / daysRemaining : 0
    };
  }, [transactions, budgets]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Spending Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly Spending Trend */}
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-muted-foreground">Monthly Trend</h3>
              {insights.trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-600" />
              )}
            </div>
            <div className="flex items-center mt-2">
              {insights.trend > 0 ? (
                <ArrowUpRight className="h-5 w-5 text-red-500 mr-2" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-green-600 mr-2" />
              )}
              <span className={insights.trend > 0 ? "text-red-500" : "text-green-600"}>
                {Math.abs(insights.trend).toFixed(1)}% {insights.trend > 0 ? 'more' : 'less'} than last month
              </span>
            </div>
          </div>
          
          {/* Top Spending Category */}
          {insights.largestCategory && (
            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <h3 className="font-medium text-muted-foreground">Top Spending Category</h3>
              <div className="mt-2">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: insights.largestCategory.color }}
                  />
                  <span className="font-medium">{insights.largestCategory.name}</span>
                </div>
                <p className="text-2xl font-semibold mt-1">
                  {formatCurrency(insights.largestCategoryAmount)}
                </p>
              </div>
            </div>
          )}
          
          {/* Over Budget Warning */}
          {insights.mostOverBudget && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
              <h3 className="font-medium text-red-600 dark:text-red-400">Budget Alert</h3>
              <p className="mt-1">
                <span className="font-medium">{insights.mostOverBudget.name}</span> is over budget by {formatCurrency(insights.mostOverBudgetAmount)}
              </p>
            </div>
          )}
          
          {/* Daily Budget */}
          <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
            <h3 className="font-medium text-muted-foreground">Daily Budget</h3>
            <p className="text-2xl font-semibold mt-1">
              {formatCurrency(insights.dailyBudget)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(insights.remainingBudget)} left for {insights.daysRemaining} days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingInsights;
