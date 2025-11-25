import React from 'react';
import { Department } from '../types';
import { ChevronRight } from 'lucide-react';

interface Props {
  department: Department;
  onSelect: (dept: Department) => void;
}

export const DepartmentCard: React.FC<Props> = ({ department, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(department)}
      className="group relative flex flex-col items-start p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all duration-300 text-left w-full"
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500">
        <ChevronRight size={20} />
      </div>
      <div className="text-4xl mb-4 p-3 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors">
        {department.icon}
      </div>
      <h3 className="font-bold text-lg text-slate-800 group-hover:text-indigo-600 transition-colors">
        {department.name}
      </h3>
      <p className="text-sm text-slate-500 mt-1">{department.category}</p>
    </button>
  );
};
