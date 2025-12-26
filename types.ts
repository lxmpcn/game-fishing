// 型別定義文件：定義遊戲中使用的所有資料結構與介面 (如魚種、遊戲狀態、道具等)。

export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Junk' | 'Treasure';
export type TimeOfDay = 'Day' | 'Night' | 'All';
// 已移除 lebron_harbor
export type LocationId = 'pond' | 'river' | 'ocean' | 'swamp' | 'deep_sea' | 'volcano' | 'sky';
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
  minSize?: number; // 雜物/寶藏可選
  maxSize?: number; // 雜物/寶藏可選
  description?: string; // 描述文本
}

export interface CaughtFish {
  uid: string;
  typeId: string;
  price: number;
  caughtAt: number;
  size?: number; // 可選，雜物/寶藏為 null
  isNewRecord?: boolean; 
  isNewSpecies?: boolean;
}

export interface FishRecord {
  caughtCount: number;
  minSize: number;
  maxSize: number;
  discovered: boolean;
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

export interface AquariumSkinDef {
  id: string;
  name: string;
  description: string;
  costGems: number;
  bgGradient: string;
  decorElement?: string;
  requiredLocation?: LocationId;
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
  currency?: 'MONEY' | 'GEMS';
}

export interface GameStats {
  totalFishCaught: number;
  totalMoneyEarned: number;
}

export interface GameState {
  money: number;
  gems: number;
  xp: number;
  inventory: CaughtFish[];
  aquarium: CaughtFish[];
  upgrades: Record<string, number>;
  unlockedFish: string[]; 
  fishRecords: Record<string, FishRecord>; 
  // 任務系統已移除
  gameTime: number;
  weather: WeatherType; 
  activeLocation: LocationId;
  unlockedLocations: LocationId[];
  
  activeBait: ActiveBait | null;
  baitInventory: Record<string, number>;
  activeBaitId: string | null;

  unlockedBobbers: string[];
  activeBobberId: string;

  // 外觀系統
  unlockedSkins: string[];
  activeSkinId: string;

  stats: GameStats;
  
  // 玩家資訊
  playerAvatar: string;
  playerName: string;

  lastSaveTime: number;
  
  // 教學狀態
  tutorialStep: number; 
}