import React from 'react';
import { formatNumber } from '../utils';

interface SharkStatsProps {
    fish: number;
    level: number;
    levelCost: number;
    handleEat: () => void;
    handleLevelUp: () => void;
    canAffordLevelUp: boolean;
}

const SharkStats: React.FC<SharkStatsProps> = ({ fish, level, levelCost, handleEat, handleLevelUp, canAffordLevelUp }) => {
    return (
        <div className="flex flex-col gap-6 py-4 mb-4 border-b border-black/5 pb-6">
            
            {/* Top Row: Shark Info & Manual Button */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-left text-sm text-shark-text font-medium min-w-[120px]">
                    <div className="text-lg underline decoration-shark-darker decoration-2 mb-1 text-gray-700">Shark Stats</div>
                    <div>Level: <span className="font-bold text-lg text-shark-darker">{level}</span></div>
                    <div>Rank: <span className="font-bold">{level < 10 ? 'Novice' : level < 25 ? 'Hunter' : 'Apex'}</span></div>
                </div>

                <button 
                    onClick={handleEat}
                    className="bg-gray-800 hover:bg-gray-700 active:bg-gray-900 text-white border-2 border-shark-darker px-8 py-4 rounded shadow-xl transform transition-transform hover:scale-105 active:scale-95 group relative overflow-hidden w-64"
                >
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-shark-orange font-bold text-lg group-hover:text-yellow-400 transition-colors">EAT FISH</span>
                        <span className="text-xs text-gray-400 mt-1">Click to generate fish</span>
                    </div>
                </button>
            </div>

            {/* Level Up Section */}
            <div className="flex justify-center w-full px-4">
                 <button 
                    onClick={handleLevelUp}
                    disabled={!canAffordLevelUp}
                    className={`
                        w-full max-w-2xl flex items-center justify-between px-6 py-3 rounded border-2 shadow-lg transition-all
                        ${canAffordLevelUp 
                            ? 'bg-shark-darker border-shark-text/20 hover:bg-shark-darker/90 cursor-pointer text-white' 
                            : 'bg-gray-300 border-gray-400 cursor-not-allowed text-gray-500 opacity-75'}
                    `}
                 >
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-lg">Level Up Shark</span>
                        <span className="text-xs opacity-80">Doubles base Fish production (x2)</span>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-bold uppercase">Cost</div>
                        <div className={`font-mono text-lg ${canAffordLevelUp ? 'text-shark-orange' : 'text-red-700'}`}>
                            {formatNumber(levelCost)} Fish
                        </div>
                    </div>
                 </button>
            </div>

            <div className="text-center text-sm max-w-lg mx-auto text-shark-text/80 italic mt-2">
                <p>Current Multiplier: <span className="font-bold text-shark-darker">x{formatNumber(Math.pow(2, level - 1))}</span> from Shark Level</p>
            </div>
        </div>
    );
};

export default SharkStats;