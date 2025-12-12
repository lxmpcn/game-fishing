
import { BAITS, BOBBERS, CATS, FISH_TYPES, QUEST_TEMPLATES } from '../constants';
import { BonusType, CaughtFish, GameState, LocationId, Rarity, UpgradeDef, WeatherType, Quest, FishRecord } from '../types';

// Utility: Order of Magnitude Formatting
export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();
  
  const units = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];
  const order = Math.floor(Math.log10(num) / 3);
  
  if (order <= 0) return Math.floor(num).toString();

  const unitname = units[Math.min(order - 1, units.length - 1)];
  const numShort = num / Math.pow(1000, order);
  
  // Keep up to 2 decimal places, remove trailing zeros
  return parseFloat(numShort.toFixed(2)).toString() + unitname;
};

export const getUpgradeCost = (upgrade: UpgradeDef, currentLevel: number): number => {
  if (currentLevel >= upgrade.maxLevel) return Infinity;
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMult, currentLevel));
};

export const getTankCapacity = (level: number): number => {
  return 5 + (level * 2); // Base 5, +2 per level
};

export const getCrewBonus = (hiredCrew: string[], crewLevels: Record<string, number>, type: BonusType): number => {
  if (!hiredCrew) return 0;
  return hiredCrew.reduce((sum, id) => {
    const cat = CATS.find(c => c.id === id);
    const level = crewLevels?.[id] || 1;
    
    // Level scaling: Each level adds 10% effectiveness to the base bonus
    const levelMultiplier = 1 + (0.1 * (level - 1));

    if (cat && cat.bonusType === type) {
      return sum + (cat.bonusValue * levelMultiplier);
    }
    return sum;
  }, 0);
};

// Calculate cost for upgrading a crew member
export const getCrewUpgradeCost = (baseCost: number, currentLevel: number): number => {
    // Price scales steeper than regular upgrades
    return Math.floor(baseCost * Math.pow(1.5, currentLevel));
};

export const calculateAquariumIncome = (aquarium: CaughtFish[], hiredCrew: string[], crewLevels: Record<string, number>): number => {
  const validFish = aquarium.filter(f => true); 
  const baseIncome = validFish.reduce((sum, fish) => {
      // Base income is 5% of price, but AT LEAST 1
      return sum + Math.max(1, Math.floor(fish.price * 0.05));
  }, 0);
  
  const multiplier = 1 + getCrewBonus(hiredCrew, crewLevels, 'INCOME_MULT');
  return Math.floor(baseIncome * multiplier);
};

export const calculateOfflineEarnings = (
  lastSaveTime: number, 
  aquarium: CaughtFish[], 
  hiredCrew: string[],
  crewLevels: Record<string, number>,
  offlineLevel: number = 0
): number => {
  const now = Date.now();
  const diffMs = now - lastSaveTime;
  
  const maxHours = 2 + offlineLevel; 
  const maxMs = maxHours * 60 * 60 * 1000;

  if (diffMs < 60 * 1000) return 0;
  
  const cappedDiffMs = Math.min(diffMs, maxMs); 
  const totalSeconds = Math.floor(cappedDiffMs / 1000);
  const ticks = Math.floor(totalSeconds / 10);
  
  const incomePerTick = calculateAquariumIncome(aquarium, hiredCrew, crewLevels);
  
  return ticks * incomePerTick;
};

export const getFish = (
  luckLevel: number, 
  gameTime: number, 
  location: LocationId, 
  activeBaitId: string | null,
  hiredCrew: string[],
  crewLevels: Record<string, number>,
  weather: WeatherType,
  safetyLevel: number = 0
): CaughtFish => {
  
  const isNight = gameTime >= 0.5;
  const currentPeriod = isNight ? 'Night' : 'Day';

  // --- Calculate Luck ---
  let luckBonus = luckLevel * 0.02; // Base luck from upgrades
  luckBonus += getCrewBonus(hiredCrew, crewLevels, 'LUCK_FLAT');

  if (weather === 'Rain') luckBonus += 0.05;
  if (weather === 'Storm') {
      luckBonus += 0.10;
      if (safetyLevel > 0) {
          luckBonus += (safetyLevel * 0.02);
      }
  }

  let reroll = false;
  if (activeBaitId) {
    const baitDef = BAITS.find(b => b.id === activeBaitId);
    if (baitDef) {
      luckBonus += baitDef.luckBonus;
      if (Math.random() < baitDef.rerollChance) {
        reroll = true;
      }
    }
  }

  // --- Determine Rarity ---
  const rollRarity = () => {
    if (Math.random() < 0.15) { 
         return Math.random() > 0.8 ? 'Treasure' : 'Junk';
    }

    const roll = Math.random() + luckBonus;
    if (roll > 0.98) return 'Mythic';
    if (roll > 0.94) return 'Legendary';
    if (roll > 0.85) return 'Epic';
    if (roll > 0.70) return 'Rare';
    return 'Common';
  };

  let rarity: Rarity = rollRarity();

  if ((rarity === 'Common' || rarity === 'Junk') && reroll) {
    rarity = rollRarity();
  }

  // --- Filter Fish ---
  let candidates = FISH_TYPES.filter(f => 
    f.locations.includes(location) && 
    f.rarity === rarity
  );

  candidates = candidates.filter(f => {
    if (f.weatherPreference) {
      return f.weatherPreference.includes(weather);
    }
    return true;
  });

  if (rarity !== 'Treasure' && rarity !== 'Junk') {
      candidates = candidates.filter(f => f.activeTime === 'All' || f.activeTime === currentPeriod);
  }

  // Fallbacks
  if (candidates.length === 0) {
     candidates = FISH_TYPES.filter(f => f.locations.includes(location) && f.rarity === rarity);
  }
  if (candidates.length === 0) {
    candidates = FISH_TYPES.filter(f => f.locations.includes(location) && f.rarity === 'Common');
  }
  if (candidates.length === 0) {
    const minnow = FISH_TYPES.find(f => f.id === 'minnow');
    if (minnow) candidates = [minnow];
  }

  const fishType = candidates[Math.floor(Math.random() * candidates.length)];

  // --- Calculate Size & Price ---
  // Junk and Treasure do not have a biological size
  const isItem = fishType.rarity === 'Junk' || fishType.rarity === 'Treasure';
  
  let finalSize: number | undefined = undefined;
  let finalPrice = fishType.basePrice;

  if (!isItem) {
      const minSize = fishType.minSize || 1;
      const maxSize = fishType.maxSize || 10;
      const sizeRange = maxSize - minSize;
      
      const randFactor = (Math.random() + Math.random() + Math.random()) / 3; 
      const size = minSize + (sizeRange * randFactor);
      finalSize = parseFloat(size.toFixed(1)); 

      // Price Calculation based on size
      const sizeMultiplier = Math.pow(finalSize / maxSize, 1.2); 
      const variance = 0.9 + (Math.random() * 0.2); // +/- 10%
      finalPrice = Math.floor(fishType.basePrice * sizeMultiplier * variance);
  } else {
      // Items have fixed price range variance but no size mult
      const variance = 0.9 + (Math.random() * 0.2); 
      finalPrice = Math.floor(fishType.basePrice * variance);
  }

  if (finalPrice < 1) finalPrice = 1;

  return {
    uid: crypto.randomUUID(),
    typeId: fishType.id,
    price: finalPrice,
    caughtAt: Date.now(),
    size: finalSize
  };
};

export const generateQuests = (currentQuests: Quest[], currentLocation: LocationId): Quest[] => {
  // Only replenish if we have less than 3 active quests
  const activeQuests = currentQuests.filter(q => !q.isClaimed);
  if (activeQuests.length >= 3) return activeQuests;

  const newQuests = [...activeQuests];
  const required = 3 - activeQuests.length;

  const typedTemplates = QUEST_TEMPLATES as Record<string, Array<{
    title: string;
    giver: string;
    desc: string;
    type: string;
    targetId?: string;
  }>>;

  const templates = typedTemplates[currentLocation] || typedTemplates['pond'];

  for (let i = 0; i < required; i++) {
    const rand = Math.random();
    const id = crypto.randomUUID();
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    let targetValue = 0;
    let reward = 0;
    let reqText = '';

    if (template.type === 'CATCH_COUNT') {
        targetValue = 5 + Math.floor(Math.random() * 10);
        reward = targetValue * 50;
        reqText = `釣起 ${targetValue} 條魚`;
    } else if (template.type === 'EARN_MONEY') {
        targetValue = 500 + Math.floor(Math.random() * 1500);
        reward = Math.floor(targetValue * 0.4);
        reqText = `賺取 ${formatNumber(targetValue)}G`;
    } else if (template.type === 'CATCH_RARITY') {
        targetValue = 2 + Math.floor(Math.random() * 3);
        const rarityName = template.targetId === 'Junk' ? '雜物' : '稀有魚';
        reward = targetValue * 200;
        reqText = `釣起 ${targetValue} 個${rarityName}`;
    }

    // Add some randomness to rewards
    reward = Math.floor(reward * (0.8 + Math.random() * 0.4));

    newQuests.push({
        id,
        title: template.title,
        giver: template.giver,
        description: template.desc,
        requirementText: reqText,
        targetType: template.type as any,
        targetValue,
        targetId: template.targetId,
        currentValue: 0,
        reward,
        isCompleted: false,
        isClaimed: false
    });
  }
  return newQuests;
};

export const saveGame = (state: GameState, username: string = 'guest') => {
  const stateToSave = {
    ...state,
    lastSaveTime: Date.now()
  };
  localStorage.setItem(`zenFisherSave_${username}`, JSON.stringify(stateToSave));
};

export const loadGame = (username: string = 'guest'): GameState | null => {
  const s = localStorage.getItem(`zenFisherSave_${username}`);
  if (s) return JSON.parse(s);

  if (username === 'guest') {
     const legacy = localStorage.getItem('zenFisherSave');
     if (legacy) return JSON.parse(legacy);
  }
  
  return null;
};

export const clearSave = (username: string = 'guest') => {
    localStorage.removeItem(`zenFisherSave_${username}`);
    if (username === 'guest') {
        localStorage.removeItem('zenFisherSave');
    }
};
