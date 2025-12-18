import React from 'react';
import { GameState, ResourceType } from '../types';
import { SCALINGS } from '../data';
import { formatNumber } from '../utils';

interface ScalingsTabProps {
  gameState: GameState;
}

const ScalingsTab: React.FC<ScalingsTabProps> = ({ gameState }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-fadeIn">
        <h2 className="text-2xl font-bold text-center text-shark-text mb-2">Scalings & Milestones</h2>
        <p className="text-center text-sm text-gray-700 mb-6">
            Scaling bonuses are applied automatically when you reach the requirement.
        </p>

        <div className="overflow-x-auto rounded-lg shadow-lg border-2 border-shark-darker bg-shark-darker">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-white uppercase bg-shark-darker border-b border-shark-text/20">
                    <tr>
                        <th scope="col" className="px-6 py-3 border-r border-shark-text/20">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3 border-r border-shark-text/20">
                            Requirement
                        </th>
                        <th scope="col" className="px-6 py-3 border-r border-shark-text/20">
                            Effect
                        </th>
                         <th scope="col" className="px-6 py-3 text-center">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-shark-bg/10 text-shark-text">
                    {SCALINGS.map((scaling, index) => {
                        const isUnlocked = scaling.isUnlocked(gameState);
                        const rowClass = isUnlocked ? 'bg-shark-bg/30' : 'bg-gray-200/50 opacity-70';
                        const target = scaling.targetResource || ResourceType.FISH;
                        
                        return (
                            <tr key={scaling.id} className={`${rowClass} border-b border-shark-darker/10 hover:bg-white/10 transition-colors`}>
                                <td className="px-6 py-4 font-medium border-r border-shark-darker/10">
                                    {scaling.name}
                                </td>
                                <td className="px-6 py-4 border-r border-shark-darker/10 font-mono">
                                    {scaling.requiredType === 'LEVEL' 
                                        ? `Shark Level ${scaling.threshold}` 
                                        : `${formatNumber(scaling.threshold)} ${scaling.requiredId === ResourceType.FISH ? 'Fish' : 'Resources'}`}
                                </td>
                                <td className="px-6 py-4 border-r border-shark-darker/10 text-shark-darker font-bold">
                                    +{scaling.bonusPercent}% {target === ResourceType.FISH ? 'Fish' : 'Prestige'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {isUnlocked ? (
                                        <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded">ACTIVE</span>
                                    ) : (
                                        <span className="px-2 py-1 text-xs font-bold text-white bg-gray-500 rounded">LOCKED</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ScalingsTab;