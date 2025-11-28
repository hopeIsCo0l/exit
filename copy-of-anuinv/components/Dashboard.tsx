import React from 'react';
import { InventoryItem, ItemCategory, Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AlertTriangle, TrendingUp, DollarSign, Package } from 'lucide-react';

interface DashboardProps {
  inventory: InventoryItem[];
  transactions: Transaction[];
  isAdmin: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ inventory, transactions, isAdmin }) => {
  const rawMaterials = inventory.filter(i => i.category === ItemCategory.RAW_MATERIAL);
  const products = inventory.filter(i => i.category === ItemCategory.PRODUCT);

  const lowStockItems = inventory.filter(i => i.quantity <= i.minStock);
  const totalValue = inventory.reduce((acc, item) => acc + (item.quantity * (item.costPerUnit || 0)), 0);
  const totalProduction = transactions.filter(t => t.type === 'PRODUCTION_FINISH').length;

  const chartData = products.map(p => ({
    name: p.name.split('(')[0].trim(),
    Stock: p.quantity,
    Min: p.minStock
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Factory Overview</h2>
            <p className="text-gray-500 text-sm">Real-time production and inventory metrics.</p>
        </div>
        <div className="text-sm font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-600 shadow-sm">
            Today: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{lowStockItems.length}</h3>
            </div>
            <div className={`p-2 rounded-lg ${lowStockItems.length > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Items below threshold</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Est. Inventory Value</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">ETB {totalValue.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-500">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Raw + Finished Goods</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Production Runs</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{totalProduction}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
              <TrendingUp size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Total batches made</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Products</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{products.length}</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
              <Package size={20} />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Varieties of candy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Finished Goods Levels</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis 
                            dataKey="name" 
                            fontSize={12} 
                            tickMargin={10} 
                            stroke="#9ca3af" 
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            fontSize={12} 
                            stroke="#9ca3af" 
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#fdf2f8' }}
                        />
                        <Bar dataKey="Stock" fill="#ec4899" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="Min" fill="#e5e7eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Low Stock List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                Critical Low Stock
                {lowStockItems.length > 0 && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{lowStockItems.length}</span>
                )}
            </h3>
            <div className="space-y-3 overflow-y-auto max-h-[22rem] pr-2 custom-scrollbar">
                {lowStockItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center">
                        <Package size={32} className="mb-2 opacity-20" />
                        <p>All stock levels healthy!</p>
                    </div>
                ) : (
                    lowStockItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100 hover:bg-red-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                    <p className="text-xs text-red-500 font-medium">{item.quantity} {item.unit} remaining</p>
                                </div>
                            </div>
                            <div className="text-xs bg-white text-red-600 px-3 py-1 rounded-lg border border-red-100 font-bold shadow-sm">
                                Min: {item.minStock}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
