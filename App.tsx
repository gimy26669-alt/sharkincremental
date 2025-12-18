import React, { useState, useEffect, useCallback } from 'react';
import { GameState, ResourceType, Tab, UpgradeDef } from './types';
import { UPGRADES, SCALINGS } from './data';
import Navigation from './components/Navigation';
import TopBar from './components/TopBar';
import UpgradeList from './components/UpgradeList';
import MainHeader from './components/MainHeader';
import SharkStats from './components/SharkStats';
import ScalingsTab from './components/ScalingsTab';
import ProgressBar from './components/ProgressBar';

const INITIAL_STATE: GameState = {
  resources: {
    [ResourceType.FISH]: 0,
    [ResourceType.PRESTIGE]: 0,
    [ResourceType.MAGMATIC]: 0,
  },
  lifetimeEarnings: {
    [ResourceType.FISH]: 0,
    [ResourceType.PRESTIGE]: 0,
    [ResourceType.MAGMATIC]: 0,
  },
  upgrades: {},
  sharkLevel: 1,
  lastTick: Date.now(),
  prestigeCount: 0,
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [currentTab, setTab] = useState<Tab>(Tab.SHARK);
  const [incomePerSecond, setIncomePerSecond] = useState(0);

  // Helper to calculate cost dynamically
  const getUpgradeCost = useCallback((upgrade: UpgradeDef, currentLevel: number) => {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
  }, []);

  const getSharkLevelCost = useCallback((currentLevel: number) => {
      // Base 100, increases by 2.5x per level
      return Math.floor(100 * Math.pow(2.5, currentLevel - 1));
  }, []);

  // Helper: Calculate Global Multiplier
  const getGlobalMultiplier = useCallback((
      currentUpgrades: Record<string, number>, 
      sharkLevel: number, 
      lifetimeEarnings: Record<ResourceType, number>,
      target: ResourceType
  ) => {
    let multiplier = 1;

    // --- Shark Level Multiplier ---
    // Shark Level naturally boosts Fish.
    if (target === ResourceType.FISH) {
        // Upgrades
        const agilityLvl = currentUpgrades['shark_agility'] || 0;
        multiplier *= (1 + (agilityLvl * 0.5));
        
        const radioLvl = currentUpgrades['radioactive_shark'] || 0;
        multiplier *= Math.pow(2, radioLvl);

        const predatorLvl = currentUpgrades['top_predator'] || 0;
        multiplier *= Math.pow(1.5, predatorLvl);

        // Shark Level bonus for Fish: 2^(Level-1)
        // Level 1 = 2^0 = 1x
        // Level 2 = 2^1 = 2x
        multiplier *= Math.pow(2, sharkLevel - 1); 
    }

    // --- Scaling Multipliers ---
    const mockState = { sharkLevel, lifetimeEarnings } as GameState; 
    
    SCALINGS.forEach(scaling => {
        // Default target is FISH if undefined
        const scalingTarget = scaling.targetResource || ResourceType.FISH;
        
        if (scalingTarget === target && scaling.isUnlocked(mockState)) {
            multiplier *= (1 + (scaling.bonusPercent / 100));
        }
    });

    return multiplier;
  }, []);

  // Helper: Calculate Fish Per Second based on upgrades and multiplier
  const calculateIncome = useCallback((currentUpgrades: Record<string, number>, sharkLevel: number, lifetimeEarnings: Record<ResourceType, number>) => {
    let base = 0;
    
    // Base Calculation
    const strengthLvl = currentUpgrades['shark_strength'] || 0;
    base += strengthLvl * 1;
    
    const huntingLvl = currentUpgrades['hunting_tactics'] || 0;
    base += huntingLvl * 10;
    
    const oceanLvl = currentUpgrades['ocean_currents'] || 0;
    base += oceanLvl * 20;

    const superLvl = currentUpgrades['super_shark'] || 0;
    if (superLvl > 0) {
        base += (Math.pow(3, superLvl) * 10); 
    }

    const multiplier = getGlobalMultiplier(currentUpgrades, sharkLevel, lifetimeEarnings, ResourceType.FISH);

    return base * multiplier;
  }, [getGlobalMultiplier]);

  // Game Loop
  useEffect(() => {
    const tickRate = 100; // 100ms
    const interval = setInterval(() => {
      setGameState((prevState) => {
        const now = Date.now();
        const deltaSeconds = (now - prevState.lastTick) / 1000;
        
        // Calculate Income
        const currentIncome = calculateIncome(prevState.upgrades, prevState.sharkLevel, prevState.lifetimeEarnings);
        
        // Update local state for UI
        setIncomePerSecond(currentIncome);

        // Add resources
        const earned = currentIncome * deltaSeconds;
        
        // Prevent adding negligible amounts or NaN
        if (earned <= 0 || isNaN(earned)) {
             return { ...prevState, lastTick: now };
        }

        return {
          ...prevState,
          resources: {
            ...prevState.resources,
            [ResourceType.FISH]: prevState.resources[ResourceType.FISH] + earned,
          },
          lifetimeEarnings: {
             ...prevState.lifetimeEarnings,
             [ResourceType.FISH]: prevState.lifetimeEarnings[ResourceType.FISH] + earned,
          },
          lastTick: now,
        };
      });
    }, tickRate);

    return () => clearInterval(interval);
  }, [calculateIncome]);

  // Actions
  const handleManualFish = () => {
    // Base click power from upgrades
    let clickPower = 1 + ((gameState.upgrades['shark_strength'] || 0) * 0.5);
    
    const razorLvl = gameState.upgrades['razor_fins'] || 0;
    clickPower += razorLvl * 50;

    // Apply global multiplier to clicks as well so Shark Level affects clicking
    const multiplier = getGlobalMultiplier(gameState.upgrades, gameState.sharkLevel, gameState.lifetimeEarnings, ResourceType.FISH);
    
    const totalClick = clickPower * multiplier;

    setGameState(prev => ({
        ...prev,
        resources: {
            ...prev.resources,
            [ResourceType.FISH]: prev.resources[ResourceType.FISH] + totalClick
        },
        lifetimeEarnings: {
            ...prev.lifetimeEarnings,
            [ResourceType.FISH]: prev.lifetimeEarnings[ResourceType.FISH] + totalClick
        }
    }));
  };

  const handleLevelUpShark = () => {
      setGameState(prev => {
          const cost = getSharkLevelCost(prev.sharkLevel);
          if (prev.resources[ResourceType.FISH] >= cost) {
              return {
                  ...prev,
                  resources: {
                      ...prev.resources,
                      [ResourceType.FISH]: prev.resources[ResourceType.FISH] - cost
                  },
                  sharkLevel: prev.sharkLevel + 1
              };
          }
          return prev;
      });
  };

  const buyUpgrade = (id: string) => {
    setGameState((prev) => {
        const upgrade = UPGRADES.find(u => u.id === id);
        if (!upgrade) return prev;

        const currentLevel = prev.upgrades[id] || 0;
        const cost = getUpgradeCost(upgrade, currentLevel);

        if (prev.resources[upgrade.currency] >= cost) {
            return {
                ...prev,
                resources: {
                    ...prev.resources,
                    [upgrade.currency]: prev.resources[upgrade.currency] - cost
                },
                upgrades: {
                    ...prev.upgrades,
                    [id]: currentLevel + 1
                }
            };
        }
        return prev;
    });
  };

  const canAfford = (cost: number, currency: ResourceType) => {
    return gameState.resources[currency] >= cost;
  };

  // Calculate Prestige Potential
  const calculatePrestigePotential = () => {
      const fish = gameState.resources[ResourceType.FISH];
      if (fish < 1000000) return 0;
      
      const base = Math.sqrt(fish / 1000000);
      const multiplier = getGlobalMultiplier(gameState.upgrades, gameState.sharkLevel, gameState.lifetimeEarnings, ResourceType.PRESTIGE);
      
      return base * multiplier;
  };

  return (
    <div className="min-h-screen bg-shark-bg text-shark-text font-sans flex flex-col pb-12">
      <TopBar 
          gameState={gameState} 
          income={incomePerSecond} 
          prestigePotential={calculatePrestigePotential()}
      />
      
      <MainHeader fish={gameState.resources[ResourceType.FISH]} income={incomePerSecond} />
      
      <Navigation currentTab={currentTab} setTab={setTab} />

      <main className="flex-1 overflow-y-auto w-full">
        {currentTab === Tab.SHARK && (
            <div className="flex flex-col animate-fadeIn">
                <SharkStats 
                    fish={gameState.resources[ResourceType.FISH]} 
                    level={gameState.sharkLevel}
                    levelCost={getSharkLevelCost(gameState.sharkLevel)}
                    handleEat={handleManualFish}
                    handleLevelUp={handleLevelUpShark}
                    canAffordLevelUp={gameState.resources[ResourceType.FISH] >= getSharkLevelCost(gameState.sharkLevel)}
                />
                <UpgradeList 
                    gameState={gameState} 
                    buyUpgrade={buyUpgrade} 
                    canAfford={canAfford} 
                    getCost={getUpgradeCost} 
                />
            </div>
        )}
        
        {currentTab === Tab.SCALINGS && (
            <ScalingsTab gameState={gameState} />
        )}
        
        {currentTab !== Tab.SHARK && currentTab !== Tab.SCALINGS && (
            <div className="flex items-center justify-center h-64 opacity-50">
                <div className="text-center">
                    <p className="text-xl font-bold mb-2">Coming Soon</p>
                    <p className="text-sm">The {currentTab} tab is under construction.</p>
                </div>
            </div>
        )}
      </main>

      <ProgressBar />
    </div>
  );
};

export default App;