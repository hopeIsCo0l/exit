import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Candy, ShieldCheck, User as UserIcon, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Mock Login Handlers
  const handleDemoLogin = (role: UserRole) => {
    if (role === 'ADMIN') {
      onLogin({
        id: 'u1',
        name: 'Admin User',
        email: 'admin@anuinv.com',
        role: 'ADMIN',
        avatar: 'A'
      });
    } else {
      onLogin({
        id: 'u2',
        name: 'Factory Supervisor',
        email: 'user@anuinv.com',
        role: 'FACTORY_MANAGER',
        avatar: 'F'
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validation goes here.
    // For demo, we just default to User role if they type something.
    handleDemoLogin('FACTORY_MANAGER');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-candy-100 via-purple-100 to-white p-4">
      <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden border border-candy-100">
        
        {/* Left Side - Brand */}
        <div className="w-full md:w-1/2 bg-candy-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                 <Candy size={32} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">AnuInv</h1>
            </div>
            <p className="text-candy-100 text-lg leading-relaxed">
              The sweetest way to manage your production line. Track inventory, calculate costs, and manage batches in real-time.
            </p>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex items-center gap-4 text-sm font-medium text-candy-200">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-candy-600"></div>
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-candy-600"></div>
                <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-candy-600"></div>
              </div>
              <span>Trusted by Top Candy Factories</span>
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-candy-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-12 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-candy-500 bg-gray-50 focus:bg-white transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-candy-500 bg-gray-50 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
               <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                 <input type="checkbox" className="rounded text-candy-600 focus:ring-candy-500" />
                 Remember me
               </label>
               <a href="#" className="text-candy-600 font-medium hover:underline">Forgot password?</a>
            </div>

            <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
              Sign In
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">Demo Access</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleDemoLogin('FACTORY_MANAGER')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
            >
              <UserIcon size={24} className="text-gray-400 group-hover:text-candy-500 mb-2" />
              <span className="text-xs font-bold text-gray-600">Staff Demo</span>
            </button>
            <button 
              onClick={() => handleDemoLogin('ADMIN')}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all group"
            >
              <ShieldCheck size={24} className="text-gray-400 group-hover:text-blue-600 mb-2" />
              <span className="text-xs font-bold text-gray-600">Admin Demo</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
