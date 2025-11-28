import React from 'react';
import { LayoutDashboard, Package, Factory, History, ShieldCheck, LogOut, Settings } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentUser, onLogout }) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'production', label: 'Production', icon: Factory },
    { id: 'transactions', label: 'History', icon: History },
  ];

  if (isAdmin) {
      menuItems.push({ id: 'admin', label: 'Admin Console', icon: ShieldCheck });
  }

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col shadow-sm sticky top-0">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold transition-colors shadow-md ${isAdmin ? 'bg-gray-900' : 'bg-candy-600'}`}>
          A
        </div>
        <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-none">AnuInv</h1>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
               v2.0 Enterprise
            </span>
        </div>
      </div>

      {/* User Profile Snippet */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${isAdmin ? 'bg-blue-500' : 'bg-candy-400'}`}>
                {currentUser?.avatar || 'U'}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-gray-500 font-medium truncate uppercase">{currentUser?.role.replace('_', ' ')}</p>
            </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2 mt-2">Menu</div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-candy-50 text-candy-600 font-semibold shadow-sm ring-1 ring-candy-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={18} className={`transition-colors ${isActive ? 'text-candy-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
         <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium">
             <Settings size={18} /> Settings
         </button>
         <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
        >
             <LogOut size={18} /> Logout
         </button>
      </div>
    </div>
  );
};
