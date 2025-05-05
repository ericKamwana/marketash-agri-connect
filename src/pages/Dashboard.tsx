
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Coins, Search, Package, Truck, User, Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';

// Mock data for dashboard
const salesData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 1200 },
];

const pendingBids = [
  {
    id: '1',
    product: 'Organic Tomatoes',
    quantity: '200 kg',
    bidAmount: '$2.80/kg',
    bidder: 'Green Grocers Ltd',
    timeLeft: '8 hours',
  },
  {
    id: '2',
    product: 'Red Onions',
    quantity: '150 kg',
    bidAmount: '$1.95/kg',
    bidder: 'Fresh Market',
    timeLeft: '3 hours',
  },
  {
    id: '3',
    product: 'Sweet Corn',
    quantity: '300 kg',
    bidAmount: '$1.70/kg',
    bidder: 'Urban Foods',
    timeLeft: '12 hours',
  },
];

const recentTransactions = [
  {
    id: '1',
    product: 'Premium Cassava',
    amount: '$1,440.00',
    buyer: 'Food Processing Co.',
    status: 'Completed',
    date: 'May 2, 2025',
  },
  {
    id: '2',
    product: 'Green Peppers',
    amount: '$900.00',
    buyer: 'City Supermarket',
    status: 'In Transit',
    date: 'May 1, 2025',
  },
  {
    id: '3',
    product: 'Green Bananas',
    amount: '$1,200.00',
    buyer: 'Fresh Exports Ltd',
    status: 'Processing',
    date: 'Apr 29, 2025',
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState('farmer');
  
  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    toast({
      title: `Switched to ${role} dashboard`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-marketash-gray py-8">
        <div className="container mx-auto px-4">
          {/* Role Switcher (For demo purposes) */}
          <div className="flex justify-end mb-6">
            <div className="bg-white rounded-md shadow-sm p-1 inline-flex">
              <button
                onClick={() => handleRoleChange('farmer')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedRole === 'farmer' 
                    ? 'bg-marketash-blue text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Farmer View
              </button>
              <button
                onClick={() => handleRoleChange('buyer')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedRole === 'buyer' 
                    ? 'bg-marketash-green text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Buyer View
              </button>
            </div>
          </div>
          
          {/* Dashboard Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-marketash-blue">
                  Welcome, {selectedRole === 'farmer' ? 'Sarah Mwangi' : 'Green Grocers Ltd'}
                </h1>
                <p className="text-gray-600">
                  {selectedRole === 'farmer' 
                    ? 'Manage your farm listings, bids, and transactions' 
                    : 'Browse listings, place bids, and manage your orders'}
                </p>
              </div>
              
              {selectedRole === 'farmer' && (
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className="bg-marketash-lightGreen px-4 py-2 rounded-md">
                    <p className="text-sm text-gray-600">Credit Score</p>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-marketash-green">780</span>
                      <span className="ml-2 text-xs bg-marketash-green text-white px-1 py-0.5 rounded flex items-center">
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        +15
                      </span>
                    </div>
                  </div>
                  <div className="ml-6">
                    <Button variant="primary">
                      Apply for Microloan
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedRole === 'buyer' && (
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className="bg-marketash-lightBlue px-4 py-2 rounded-md">
                    <p className="text-sm text-gray-600">Active Bids</p>
                    <p className="text-xl font-bold text-marketash-blue">8</p>
                  </div>
                  <div className="ml-6">
                    <Button variant="primary">
                      Browse Marketplace
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-marketash-lightBlue p-3 rounded-md">
                  <Package className="h-6 w-6 text-marketash-blue" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Listings</p>
                  <p className="text-2xl font-bold">{selectedRole === 'farmer' ? '6' : '—'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-marketash-lightGreen p-3 rounded-md">
                  <Coins className="h-6 w-6 text-marketash-green" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">${selectedRole === 'farmer' ? '5,840' : '7,290'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-marketash-lightBlue p-3 rounded-md">
                  <Truck className="h-6 w-6 text-marketash-blue" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pending Delivery</p>
                  <p className="text-2xl font-bold">{selectedRole === 'farmer' ? '3' : '2'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-marketash-lightGreen p-3 rounded-md">
                  <User className="h-6 w-6 text-marketash-green" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">{selectedRole === 'farmer' ? 'Regular Buyers' : 'Trusted Farmers'}</p>
                  <p className="text-2xl font-bold">{selectedRole === 'farmer' ? '12' : '8'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content: Charts, Tables, etc. */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">
                  {selectedRole === 'farmer' ? 'Monthly Sales Performance' : 'Monthly Purchase History'}
                </h2>
                <div className="flex items-center">
                  <Button variant="ghost" className="text-marketash-blue text-sm">
                    Export
                  </Button>
                </div>
              </div>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name={selectedRole === 'farmer' ? 'Sales (USD)' : 'Purchases (USD)'} 
                      fill={selectedRole === 'farmer' ? '#0B5394' : '#4CAF50'} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Calendar/Upcoming Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                <Button variant="ghost" className="text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  View Calendar
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start p-3 bg-marketash-lightBlue rounded-md">
                  <div className="flex flex-col items-center mr-4">
                    <span className="text-xs font-medium text-marketash-blue">MAY</span>
                    <span className="text-xl font-bold text-marketash-blue">06</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Tomato Harvest Due</h4>
                    <p className="text-sm text-gray-600">Estimated yield: 500kg</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-marketash-lightGreen rounded-md">
                  <div className="flex flex-col items-center mr-4">
                    <span className="text-xs font-medium text-marketash-green">MAY</span>
                    <span className="text-xl font-bold text-marketash-green">10</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Microloan Payment</h4>
                    <p className="text-sm text-gray-600">$250 installment due</p>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-gray-100 rounded-md">
                  <div className="flex flex-col items-center mr-4">
                    <span className="text-xs font-medium text-gray-500">MAY</span>
                    <span className="text-xl font-bold text-gray-500">15</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Agricultural Workshop</h4>
                    <p className="text-sm text-gray-600">Sustainable farming practices</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View All Events
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Pending Bids */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">
                  {selectedRole === 'farmer' ? 'Pending Bids on Your Produce' : 'Your Active Bids'}
                </h2>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-9 py-1 pr-3 text-sm border border-gray-200 rounded-md"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bid Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {selectedRole === 'farmer' ? 'Bidder' : 'Farmer'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Left
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingBids.map((bid) => (
                      <tr key={bid.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium">{bid.product}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {bid.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-marketash-blue font-medium">
                          {bid.bidAmount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {bid.bidder}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                            {bid.timeLeft}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                <Button variant="ghost" className="text-sm text-marketash-blue">
                  View All
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {selectedRole === 'farmer' ? 'Buyer' : 'Farmer'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium">{transaction.product}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-medium">
                          {transaction.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {transaction.buyer}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            transaction.status === 'Completed' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'In Transit'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
