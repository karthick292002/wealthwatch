
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction, Category } from '@/utils/types';
import { Pencil, Trash2, ArrowDown, ArrowUp } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  categories: Category[];
}

type SortField = 'date' | 'amount' | 'description';
type SortDirection = 'asc' | 'desc';

const TransactionList = ({ transactions, onEdit, onDelete, categories }: TransactionListProps) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    
    if (sortField === 'amount') {
      return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    
    // description
    return sortDirection === 'asc'
      ? a.description.localeCompare(b.description)
      : b.description.localeCompare(a.description);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
    
    return (
      <span className={type === 'income' ? 'text-green-600' : 'text-red-500'}>
        {type === 'income' ? '+' : '-'} {formattedAmount}
      </span>
    );
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const getCategoryColor = (categoryId?: string) => {
    if (!categoryId) return '#64748b';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#64748b';
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="inline ml-1 w-4 h-4" /> 
      : <ArrowDown className="inline ml-1 w-4 h-4" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle className="text-xl">Transactions</CardTitle>
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => handleSort('date')}
                >
                  Date <SortIcon field="date" />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => handleSort('description')}
                >
                  Description <SortIcon field="description" />
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-slate-50 text-right"
                  onClick={() => handleSort('amount')}
                >
                  Amount <SortIcon field="amount" />
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      {transaction.category && (
                        <Badge 
                          style={{ 
                            backgroundColor: getCategoryColor(transaction.category),
                            color: '#fff' 
                          }}
                        >
                          {getCategoryName(transaction.category)}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatAmount(transaction.amount, transaction.type)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(transaction)}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(transaction.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    {search ? 'No transactions match your search' : 'No transactions found'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
