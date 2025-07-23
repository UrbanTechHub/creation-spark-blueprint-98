
import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Filter, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
}

const transactions: Transaction[] = [
  { id: '1', date: '2025-04-15', description: 'Consultancy Payment', type: 'credit', amount: 8000.00, balance: 120000.00 },
  { id: '2', date: '2025-04-10', description: 'House Maintenance', type: 'debit', amount: -2500.00, balance: 112000.00 },
  { id: '3', date: '2025-04-01', description: 'Salary', type: 'credit', amount: 30000.00, balance: 114500.00 },
  { id: '4', date: '2025-03-25', description: 'Bonus', type: 'credit', amount: 12000.00, balance: 84500.00 },
  { id: '5', date: '2025-03-12', description: 'Car Purchase Down Payment', type: 'debit', amount: -10000.00, balance: 72500.00 },
  { id: '6', date: '2025-03-01', description: 'Salary', type: 'credit', amount: 30000.00, balance: 82500.00 },
  { id: '7', date: '2025-02-15', description: 'Stock Dividends', type: 'credit', amount: 4200.00, balance: 52500.00 },
  { id: '8', date: '2025-02-08', description: 'Travel Expenses', type: 'debit', amount: -3000.00, balance: 48300.00 },
  { id: '9', date: '2025-02-01', description: 'Salary', type: 'credit', amount: 30000.00, balance: 51300.00 },
  { id: '10', date: '2025-01-25', description: 'Laptop Purchase', type: 'debit', amount: -1200.00, balance: 21300.00 },
  { id: '11', date: '2025-01-20', description: 'Rent Payment', type: 'debit', amount: -2500.00, balance: 22500.00 },
  { id: '12', date: '2025-01-15', description: 'Freelance Payment', type: 'credit', amount: 15000.00, balance: 25000.00 },
  { id: '13', date: '2025-01-05', description: 'Opening Balance', type: 'credit', amount: 10000.00, balance: 10000.00 },
];

export const TransactionHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        return Math.abs(b.amount) - Math.abs(a.amount);
      }
      return 0;
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatAmount = (amount: number) => {
    return `${amount > 0 ? '+' : ''}$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Transaction History</h1>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="credit">Credits</SelectItem>
              <SelectItem value="debit">Debits</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="p-4">
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {transaction.type}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatAmount(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-gray-900">
                      ${transaction.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};
