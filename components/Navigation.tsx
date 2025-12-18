import React from 'react';
import { Tab } from '../types';

interface NavigationProps {
  currentTab: Tab;
  setTab: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, setTab }) => {
  const tabs = Object.values(Tab);

  return (
    <div className="flex w-full bg-shark-darker p-1 gap-1 overflow-x-auto shadow-lg sticky top-0 z-20">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setTab(tab)}
          className={`
            flex-1 py-1 px-2 text-sm font-bold uppercase tracking-wider rounded border-2 transition-all duration-100 whitespace-nowrap
            ${
              currentTab === tab
                ? 'bg-shark-dark border-shark-text/50 text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'
                : 'bg-shark-bg border-transparent text-shark-text hover:bg-shark-bg/80 hover:border-shark-text/20'
            }
          `}
        >
            <span className={tab === Tab.SHARK ? 'drop-shadow-md text-gray-800' : 
                             tab === Tab.RESEARCH ? 'text-cyan-200' : 
                             tab === Tab.CORE ? 'text-orange-300' : 
                             tab === Tab.EVOLUTION ? 'text-green-400' : ''}>
              {tab}
            </span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;
