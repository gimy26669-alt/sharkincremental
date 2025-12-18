import React from 'react';
import { GameState, ResourceType } from '../types';
import { formatNumber } from '../utils';

interface TopBarProps {
  gameState: GameState;
  income: number;
  prestigePotential: number;
}

const TopBar: React.FC<TopBarProps> = ({ gameState, income, prestigePotential }) => {
  return (
    <div className="w-full flex justify-between items-start px-4 py-2 text-sm font-semibold text-center border-b border-shark-darker bg-shark-bg shadow-md z-10">
        
        {/* Prestige Resource */}
        <div className="flex flex-col items-center flex-1">
            <div className="text-shark-text">
                <span className="text-lg">{formatNumber(gameState.resources[ResourceType.PRESTIGE])}</span>
                <span className="text-shark-blue ml-1">Prestige</span> Shards
            </div>
            <div className="mt-1 px-4 py-1 bg-shark-darker text-white text-xs rounded border border-white/20 shadow-inner cursor-pointer hover:bg-gray-700 transition">
                Prestige for <span className="font-bold text-shark-blue">{formatNumber(prestigePotential)}</span> Shards
            </div>
        </div>

        {/* Magmatic Resource */}
        <div className="flex flex-col items-center flex-1 border-l border-r border-black/10">
            <div className="text-shark-text">
                <span className="text-lg">{formatNumber(gameState.resources[ResourceType.MAGMATIC])}</span>
                <span className="text-shark-orange ml-1">Magmatic</span> Fragments
            </div>
            <div className="mt-1 px-4 py-1 bg-shark-darker text-white text-xs rounded border border-white/20 shadow-inner cursor-pointer hover:bg-gray-700 transition">
                Enter the core for <span className="font-bold text-shark-orange">0</span> Fragments
            </div>
        </div>

         {/* Humanoid Resource (Example from screenshot) */}
         <div className="flex flex-col items-center flex-1">
            <div className="text-shark-text">
                <span className="text-lg">{formatNumber(0)}</span>
                <span className="text-green-400 ml-1">Humanoid</span> Sharks
            </div>
             <div className="mt-1 px-4 py-1 bg-shark-darker text-white text-xs rounded border border-white/20 shadow-inner cursor-pointer hover:bg-gray-700 transition">
                Reach <span className="font-bold text-red-500">e3e196</span> Fish
            </div>
        </div>

    </div>
  );
};

export default TopBar;