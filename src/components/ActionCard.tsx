import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ActionCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  category: string;
  onClick?: () => void;
}

export default function ActionCard({ 
  icon: Icon, 
  iconColor, 
  title, 
  description, 
  bgColor, 
  textColor, 
  category,
  onClick 
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${textColor} rounded-xl p-5 text-left transition-all hover:scale-[1.02] hover:shadow-lg w-full h-full flex flex-col`}
    >
      <div className="flex items-center space-x-2 mb-3">
        <div className={`${iconColor} p-1.5 rounded-md`}>
          <Icon size={14} />
        </div>
        <span className="text-xs font-medium opacity-80 uppercase tracking-wide">{category}</span>
      </div>
      
      <h3 className="text-base font-semibold mb-2 leading-tight">{title}</h3>
      <p className="text-sm opacity-90 leading-relaxed flex-1">{description}</p>
    </button>
  );
}