import React from 'react';
import { GameState, ResourceType, UpgradeDef } from '../types';
import { UPGRADES } from '../data';
import { formatNumber } from '../utils';

interface UpgradeListProps {
  gameState: GameState;
  buyUpgrade: (id: string) => void;
  canAfford: (cost: number, currency: ResourceType) => boolean;
  getCost: (upgrade: UpgradeDef, currentLevel: number) => number;
}

const UpgradeList: React.FC<UpgradeListProps> = ({ gameState, buyUpgrade, canAfford, getCost }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2 w-full">
      {UPGRADES.map((upgrade) => {
        const level = gameState.upgrades[upgrade.id] || 0;
        const cost = getCost(upgrade, level);
        const affordable = canAfford(cost, upgrade.currency);

        return (
          <div
            key={upgrade.id}
            className="flex flex-col justify-between bg-shark-darker/40 border border-shark-darker rounded-md p-2 hover:bg-shark-darker/60 transition-colors min-h-[110px]"
          >
            {/* Top: Name and Level */}
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-bold text-shark-text leading-tight">{upgrade.name}</h3>
              <span className="text-xs bg-black/20 px-1.5 rounded text-white font-mono">Lvl {formatNumber(level)}</span>
            </div>

            {/* Middle: Description */}
            <div className="text-xs text-shark-text/90 mb-2 flex-grow">
              <p className="opacity-80 leading-snug">{upgrade.description(level)}</p>
              <p className="font-bold mt-0.5 text-black">{upgrade.effectDescription(level)}</p>
            </div>

            {/* Bottom: Button */}
            <button
              onClick={() => buyUpgrade(upgrade.id)}
              disabled={!affordable}
              className={`
                w-full py-1.5 px-2 rounded text-xs font-bold uppercase tracking-wide border shadow-sm
                flex items-center justify-between transition-all active:scale-95
                ${
                  affordable
                    ? 'bg-shark-darker border-transparent text-white hover:bg-shark-text hover:text-white'
                    : 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <span>Buy</span>
              <span className={
                  !affordable ? "text-gray-400" :
                  upgrade.currency === ResourceType.FISH ? "text-shark-orange" : 
                  "text-shark-blue"
              }>
                {formatNumber(cost)} {upgrade.currency === ResourceType.FISH ? 'Fish' : 'Shards'}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default UpgradeList;