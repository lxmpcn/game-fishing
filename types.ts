
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Junk' | 'Treasure';
export type TimeOfDay = 'Day' | 'Night' | 'All';
export type LocationId = 'pond' | 'river' | 'ocean' | 'swamp' | 'sky' | 'deep_sea';
export type WeatherType = 'Sunny' | 'Rain' | 'Storm';

export interface FishType {
  id: string;
  name: string;
  rarity: Rarity;
  basePrice: number;
  color: string;
  activeTime: TimeOfDay;
  locations: LocationId[];
  weatherPreference?: WeatherType[];
  minSize?: number; // Optional for Junk/Treasure
  maxSize?: number; // Optional for Junk/Treasure
  description?: string; // Flavor text
}

export interface CaughtFish {
  uid: string;
  typeId: string;
  price: number;
  caughtAt: number;
  size?: number; // Optional, null for Junk/Treasure
  isNewRecord?: boolean; 
  isNewSpecies?: boolean;
}

export interface FishRecord {
  caughtCount: number;
  minSize: number;
  maxSize: number;
  discovered: boolean;
}

export interface Quest {
  id: string;
  title: string; // New: Short title like "Grandpa's Recipe"
  giver: string; // New: Who gave the quest?
  description: string; // Flavor text
  requirementText: string; // Short text like "Catch 5 Fish" for UI
  targetType: 'CATCH_COUNT' | 'EARN_MONEY' | 'CATCH_RARITY' | 'CATCH_SPECIFIC';
  targetValue: number;
  targetId?: string; // Can be species ID or Rarity
  currentValue: number;
  reward: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export type UpgradeType = 'SPEED' | 'LUCK' | 'AUTO_CAST' | 'AUTO_REEL' | 'AUTO_SELL' | 'TANK_SIZE' | 'OFFLINE' | 'SAFETY';

export interface UpgradeDef {
  id: string;
  name: string;
  type: UpgradeType;
  description: string;
  baseCost: number;
  costMult: number;
  maxLevel: number;
  icon?: string;
}

export interface BaitDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  charges: number;
  luckBonus: number;
  rerollChance: number;
}

export interface BobberDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  biteTimeBonus: number; 
  lureSpeedBonus: number; 
  iconColor: string;
}

// New: Aquarium Skins with Unlock Logic
export interface AquariumSkinDef {
  id: string;
  name: string;
  description: string;
  costGems: number;
  bgGradient: string;
  decorElement?: string; // For rendering special CSS/SVG decor
  requiredLocation?: LocationId; // New field: Requires this map to be unlocked
}

export interface ActiveBait {
  id: string;
  chargesRemaining: number;
}

export interface LocationDef {
  id: LocationId;
  name: string;
  cost: number;
  description: string;
  bgGradient: string;
}

export type BonusType = 'INCOME_MULT' | 'PRICE_MULT' | 'LUCK_FLAT' | 'SPEED_MULT' | 'XP_MULT';

export interface CatDef {
  id: string;
  name: string;
  title: string;
  description: string;
  cost: number;
  bonusType: BonusType;
  bonusValue: number;
  color: string; 
}

export interface GameStats {
  totalFishCaught: number;
  totalMoneyEarned: number;
}

export interface StoryEvent {
  id: string;
  trigger: 'START' | 'CATCH_1' | 'EARN_1000' | 'UNLOCK_LOCATION';
  title: string;
  content: string;
  speaker: 'PLAYER' | 'SHOPKEEPER';
}

export interface GameState {
  money: number;
  gems: number; // New Currency
  xp: number;
  inventory: CaughtFish[];
  aquarium: CaughtFish[];
  upgrades: Record<string, number>;
  unlockedFish: string[]; 
  fishRecords: Record<string, FishRecord>; 
  quests: Quest[]; 
  gameTime: number;
  weather: WeatherType; 
  activeLocation: LocationId;
  unlockedLocations: LocationId[];
  
  activeBait: ActiveBait | null;
  baitInventory: Record<string, number>;
  activeBaitId: string | null;

  unlockedBobbers: string[];
  activeBobberId: string;

  // Skin System
  unlockedSkins: string[];
  activeSkinId: string;

  hiredCrew: string[];
  crewLevels: Record<string, number>;
  
  stats: GameStats;
  
  viewedStories: string[];
  
  lastSaveTime: number;
}
