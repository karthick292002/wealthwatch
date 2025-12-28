
import { Transaction, Category, Budget } from './types';

export const categories: Category[] = [
  { id: 'housing', name: 'Housing', color: '#4338ca' },
  { id: 'food', name: 'Food', color: '#16a34a' },
  { id: 'transportation', name: 'Transportation', color: '#f59e0b' },
  { id: 'entertainment', name: 'Entertainment', color: '#db2777' },
  { id: 'utilities', name: 'Utilities', color: '#0891b2' },
  { id: 'healthcare', name: 'Healthcare', color: '#7c3aed' },
  { id: 'personal', name: 'Personal', color: '#d946ef' },
  { id: 'education', name: 'Education', color: '#84cc16' },
  { id: 'other', name: 'Other', color: '#64748b' },
  { id: 'income', name: 'Income', color: '#22c55e' }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 2500,
    date: '2025-04-01',
    description: 'Salary',
    type: 'income',
    category: 'income'
  },
  {
    id: '2',
    amount: 800,
    date: '2025-04-02',
    description: 'Rent',
    type: 'expense',
    category: 'housing'
  },
  {
    id: '3',
    amount: 120,
    date: '2025-04-03',
    description: 'Groceries',
    type: 'expense',
    category: 'food'
  },
  {
    id: '4',
    amount: 65,
    date: '2025-04-05',
    description: 'Utilities',
    type: 'expense',
    category: 'utilities'
  },
  {
    id: '5',
    amount: 200,
    date: '2025-04-10',
    description: 'Freelance work',
    type: 'income',
    category: 'income'
  },
  {
    id: '6',
    amount: 35,
    date: '2025-04-12',
    description: 'Dinner',
    type: 'expense',
    category: 'food'
  },
  {
    id: '7',
    amount: 90,
    date: '2025-04-15',
    description: 'Gas',
    type: 'expense',
    category: 'transportation'
  }
];

export const mockBudgets: Budget[] = [
  { category: 'housing', amount: 1000, month: '2025-04' },
  { category: 'food', amount: 350, month: '2025-04' },
  { category: 'transportation', amount: 150, month: '2025-04' },
  { category: 'entertainment', amount: 200, month: '2025-04' },
  { category: 'utilities', amount: 100, month: '2025-04' },
  { category: 'healthcare', amount: 150, month: '2025-04' },
  { category: 'personal', amount: 100, month: '2025-04' },
  { category: 'education', amount: 100, month: '2025-04' },
  { category: 'other', amount: 200, month: '2025-04' }
];

export const getCategoryById = (id: string): Category => {
  return categories.find(category => category.id === id) || { id: 'unknown', name: 'Unknown', color: '#64748b' };
};

export const getCategoryColor = (categoryId: string): string => {
  return getCategoryById(categoryId).color;
};
