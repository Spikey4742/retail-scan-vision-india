
import React from 'react';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const Header = ({ title, showBackButton = false, onBack }: HeaderProps) => {
  return (
    <header className="bg-retailVision-primary text-white p-4 flex items-center justify-center relative">
      {showBackButton && (
        <button 
          onClick={onBack} 
          className="absolute left-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      )}
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
};

export default Header;
