export enum ResourceType {
  FISH = 'FISH',
  PRESTIGE = 'PRESTIGE',
  MAGMATIC = 'MAGMATIC'
}

export enum Tab {
  SHARK = 'Shark',
  OPTIONS = 'Options',
  SCALINGS = 'Scalings',
  AUTOMATION = 'Automation',
  RESEARCH = 'Research',
  EXPLORATION = 'Exploration',
  CORE = 'Core',
  EVOLUTION = 'Evolution'
}

export interface UpgradeDef {
  id: string;
  name: string;
  description: (level: number) => string;
  effectDescription: (level: number) => string;
  baseCost: number;
  costMultiplier: number; // How much cost increases per level
  currency: ResourceType;
  basePower: number; // Base power added per level
  isExponential?: boolean; // If true, effect is exponential
}

export interface ScalingDef {
    id: string;
    name: string;
    requiredType: 'LEVEL' | 'RESOURCE';
    requiredId?: string; // If 'RESOURCE', use ResourceType key
    threshold: number;
    bonusPercent: number; // e.g. 100 for +100%
    isUnlocked: (gameState: GameState) => boolean;
    targetResource?: ResourceType; // Defaults to FISH if undefined
}

export interface GameState {
  resources: {
    [key in ResourceType]: number;
  };
  lifetimeEarnings: {
    [key in ResourceType]: number;
  };
  upgrades: Record<string, number>; // Upgrade ID -> Level
  sharkLevel: number;
  lastTick: number;
  prestigeCount: number;
}