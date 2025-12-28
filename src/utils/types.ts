
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category?: string;
}

export interface TransactionFormData {
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Budget {
  category: string;
  amount: number;
  month: string; // Format: YYYY-MM
}
