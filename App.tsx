// 主應用程式組件：管理遊戲核心狀態 (State)、遊戲迴圈 (Loop) 與各個子畫面的切換邏輯。

import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import FishingScene from './components/GameView';
import Inventory from './components/Inventory';
import Aquarium from './components/Aquarium';
import Shop from './components/Shop';
import PixelCard from './components/PixelCard';
import StartScreen from './components/StartScreen';
import LoginScreen from './components/LoginScreen';
import AlmanacModal from './components/AlmanacModal';
import ProfileModal from './components/ProfileModal';
import TutorialOverlay from './components/TutorialOverlay'; 
import { Particle } from './components/ParticleOverlay';
import { GameState, WeatherType, FishRecord } from './types';
import { UPGRADES, BAITS, LOCATIONS, FISH_TYPES, BOBBERS, AQUARIUM_SKINS } from './constants';
import { getFish, getUpgradeCost, loadGame, saveGame, getTankCapacity, calculateAquariumIncome, calculateOfflineEarnings, formatNumber } from './services/gameService';
import { soundManager } from './services/soundService';
import { Coins } from 'lucide-react';

// Initial Game State
const INITIAL_STATE: GameState = {
  money: 0,
  gems: 0, 
  xp: 0,
  inventory: [],
  aquarium: [],
  upgrades: {},
  unlockedFish: [],
  fishRecords: {},
  // quests removed
  gameTime: 0.2,
  weather: 'Sunny',
  activeLocation: 'pond',
  unlockedLocations: ['pond'],
  activeBait: null,
  baitInventory: {},
  activeBaitId: null,
  unlockedBobbers: ['classic'],
  activeBobberId: 'classic',
  
  // Skin System
  unlockedSkins: ['default'],
  activeSkinId: 'default',

  stats: {
    totalFishCaught: 0,
    totalMoneyEarned: 0,
  },
  
  // Special Flags
  // canBuyLebronMap removed
  playerAvatar: 'guest', // Default
  playerName: '冒險者', // Default Name

  lastSaveTime: Date.now(),
  
  // Tutorial State (0=Done, 1=Start)
  tutorialStep: 0
};

type GameStatus = 'IDLE' | 'CASTING' | 'WAITING' | 'BITING' | 'REELING';
type AppPhase = 'LOGIN' | 'START' | 'GAME';

const App: React.FC = () => {
  // --- STATE ---
  const [appPhase, setAppPhase] = useState<AppPhase>('START');
  const [currentUser, setCurrentUser] = useState<string>('guest');
  
  const [showAlmanac, setShowAlmanac] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'INVENTORY' | 'SHOP' | 'AQUARIUM'>('INVENTORY');
  const [showMapSelector, setShowMapSelector] = useState(false);
  
  // New States for Effects & Offline
  const [particles, setParticles] = useState<Particle[]>([]);
  const [offlineEarnings, setOfflineEarnings] = useState<number>(0);
  const [isShaking, setIsShaking] = useState(false); // Screen Shake State

  // Combo System
  const [combo, setCombo] = useState(0);
  const [lastCatchTime, setLastCatchTime] = useState(0);
  
  // Refs
  const stateRef = useRef(gameState);
  const statusRef = useRef(status);
  const currentUserRef = useRef(currentUser);
  
  const isDev = currentUser === '11111';

  useEffect(() => { stateRef.current = gameState; }, [gameState]);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  // --- AUDIO & STARTUP ---
  useEffect(() => {
    if(appPhase === 'GAME') {
      soundManager.updateAmbience(gameState.activeLocation, gameState.weather);
    }
  }, [gameState.activeLocation, gameState.weather, appPhase]);

  // --- LOGIN LOGIC ---
  const goToLogin = () => {
      soundManager.playSfx('CLICK');
      setAppPhase('LOGIN');
  };

  const handleLogin = (username: string, isDevAcc: boolean, displayName?: string) => {
    setCurrentUser(username);
    soundManager.init();
    soundManager.playSfx('CLICK');
    
    // Load data specific to this user
    const saved = loadGame(username);
    
    let nextState = { ...INITIAL_STATE };

    if (saved) {
      // Calculate offline earnings if normal save exists
      if (saved.lastSaveTime && saved.aquarium.length > 0) {
        const offlineLevel = saved.upgrades['offline_storage'] || 0;
        const earned = calculateOfflineEarnings(saved.lastSaveTime, saved.aquarium, offlineLevel);
        if (earned > 0) {
          setOfflineEarnings(earned);
          saved.money += earned;
          if (saved.stats) saved.stats.totalMoneyEarned += earned;
        }
      }

      // DATA MIGRATION Logic
      if (saved.activeBait && !saved.baitInventory) {
          saved.baitInventory = { [saved.activeBait.id]: saved.activeBait.chargesRemaining };
          saved.activeBaitId = saved.activeBait.id;
          saved.activeBait = null;
      }
      if (!saved.unlockedBobbers) {
          saved.unlockedBobbers = ['classic'];
          saved.activeBobberId = 'classic';
      }
      if (!saved.unlockedSkins) {
          saved.unlockedSkins = ['default'];
          saved.activeSkinId = 'default';
      }
      // Initialize stats if missing
      if (!saved.stats) {
          saved.stats = { totalFishCaught: 0, totalMoneyEarned: 0 };
      }

      nextState = { 
        ...nextState, 
        ...saved,
        fishRecords: saved.fishRecords || {},
        // quests removed
        baitInventory: saved.baitInventory || {},
        activeBaitId: saved.activeBaitId || null,
        unlockedBobbers: saved.unlockedBobbers || ['classic'],
        activeBobberId: saved.activeBobberId || 'classic',
        unlockedSkins: saved.unlockedSkins || ['default'],
        activeSkinId: saved.activeSkinId || 'default',
        activeBait: null, 
        // canBuyLebronMap logic removed
        playerAvatar: saved.playerAvatar || 'guest',
        playerName: saved.playerName || displayName || username, 
        lastSaveTime: Date.now(),
        // Ensure tutorial step is loaded, default to 0 (done) for existing saves unless explicitly 0 is new
        tutorialStep: saved.tutorialStep !== undefined ? saved.tutorialStep : 0
      };
    } else {
        // New Game - Set playerName & Tutorial Step 1
        nextState.playerName = displayName || username;
        nextState.tutorialStep = 1; // Start tutorial for new players
    }

    if (isDevAcc) {
      // Super Account Logic
      nextState.money = 999999999;
      nextState.gems = 9999;
      nextState.xp = 1000000;
      nextState.unlockedLocations = LOCATIONS.map(l => l.id as any);
      // nextState.canBuyLebronMap = true; // Removed
      nextState.unlockedBobbers = BOBBERS.map(b => b.id);
      nextState.unlockedSkins = AQUARIUM_SKINS.map(s => s.id);
      nextState.baitInventory['basketball_bait'] = 999;
      nextState.tutorialStep = 0; // Skip tutorial
      
      // Max Upgrades
      const maxUpgrades: Record<string, number> = {};
      UPGRADES.forEach(u => { maxUpgrades[u.id] = u.maxLevel; });
      nextState.upgrades = maxUpgrades;

      // Unlock all fish in Almanac
      const allFishRecords: Record<string, FishRecord> = {};
      FISH_TYPES.forEach(f => {
          allFishRecords[f.id] = {
              caughtCount: 1,
              minSize: f.minSize || 1,
              maxSize: f.maxSize || 10,
              discovered: true
          }
      });
      nextState.fishRecords = allFishRecords;
    }

    setGameState(nextState);
    setAppPhase('GAME');
  };

  const handleGuestLogin = (guestName: string) => {
      // Use standard handleLogin with 'guest' UID but custom display name
      handleLogin('guest', false, guestName);
  };

  const handleLogout = () => {
      saveGame(stateRef.current, currentUserRef.current); // Force save before exit
      setAppPhase('START');
      setGameState(INITIAL_STATE);
      setShowProfile(false);
  };

  const handleResetSave = () => {
    // Soft Reset: Overwrite save with initial state but keep the file/key (Account preservation)
    const resetState = { ...INITIAL_STATE, playerName: gameState.playerName, tutorialStep: 1 };
    saveGame(resetState, currentUser);
    setGameState(resetState);
    setShowProfile(false);
    // Restart the game flow
    setAppPhase('START');
  };

  const changeAvatar = (avatarId: string) => {
      soundManager.playSfx('CLICK');
      setGameState(prev => ({ ...prev, playerAvatar: avatarId }));
  };

  const changeName = (newName: string) => {
      soundManager.playSfx('CLICK');
      setGameState(prev => ({ ...prev, playerName: newName }));
  };

  // Save Loop
  useEffect(() => {
    if (appPhase !== 'GAME') return;
    const interval = setInterval(() => saveGame(stateRef.current, currentUserRef.current), 5000);
    return () => clearInterval(interval);
  }, [appPhase]);

  // Particle Loop
  useEffect(() => {
    const pTimer = setInterval(() => {
      setParticles(prev => {
        const next = prev.map(p => ({
          ...p,
          x: p.x + p.velocity.x,
          y: p.y + p.velocity.y,
          life: p.life - 0.05
        })).filter(p => p.life > 0);
        return next;
      });
    }, 50);
    return () => clearInterval(pTimer);
  }, []);

  const spawnParticles = (count: number, x: number, y: number, color: string, type: 'TEXT' | 'SPARKLE', text?: string) => {
    const newParticles: Particle[] = [];
    for(let i=0; i<count; i++) {
      newParticles.push({
        id: Math.random().toString(36),
        x: x + (Math.random() * 10 - 5),
        y: y + (Math.random() * 10 - 5),
        color: color,
        size: type === 'TEXT' ? 16 : (Math.random() * 4 + 2),
        text: text,
        type: type,
        life: 1.0,
        velocity: {
          x: (Math.random() - 0.5) * 0.5,
          y: type === 'TEXT' ? -1 : (Math.random() - 0.5) * 0.5 - 0.5 
        }
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // --- GAME LOOP ---
  const comboRef = useRef(combo);
  useEffect(() => { comboRef.current = combo; }, [combo]);

  useEffect(() => {
    if (appPhase !== 'GAME') return;

    const tickRate = 50; 
    let ticks = 0;
    
    const timer = setInterval(() => {
      ticks++;
      const s = stateRef.current;
      const currentStatus = statusRef.current;
      const currentCombo = comboRef.current; 

      // 1. Time Cycle
      const dayDurationTicks = 2400; 
      const timeIncrement = 1 / dayDurationTicks;
      if (ticks % 5 === 0) {
        setGameState(prev => {
          let newTime = prev.gameTime + (timeIncrement * 5);
          if (newTime >= 1) newTime = 0;
          return { ...prev, gameTime: newTime };
        });
      }

      // 2. Weather Cycle (3 mins)
      if (ticks % 3600 === 0) {
         setGameState(prev => {
           const roll = Math.random();
           let newWeather: WeatherType = 'Sunny';
           if (roll > 0.7) newWeather = 'Rain';
           if (roll > 0.9) newWeather = 'Storm';
           return { ...prev, weather: newWeather };
         });
      }

      // 3. Aquarium Income
      if (ticks % 200 === 0 && s.aquarium.length > 0) {
        const income = calculateAquariumIncome(s.aquarium);
        if (income > 0) {
          setGameState(prev => ({
             ...prev,
             money: prev.money + income,
             stats: { ...prev.stats, totalMoneyEarned: prev.stats.totalMoneyEarned + income }
          }));
        }
      }

      // Quest Generation Removed

      // --- Fishing Logic ---
      const rodLevel = s.upgrades['rod_speed'] || 0;
      const autoReelLevel = s.upgrades['auto_reel'] || 0;
      const comboSpeedBonus = currentCombo * 0.1;
      
      // Bobber Bonuses
      const currentBobber = BOBBERS.find(b => b.id === s.activeBobberId) || BOBBERS[0];
      const bobberLureBonus = currentBobber.lureSpeedBonus || 0;
      const bobberBiteBonus = currentBobber.biteTimeBonus || 0;

      const speedMult = 1 + comboSpeedBonus + bobberLureBonus;

      if (currentStatus === 'CASTING') {
        const autoCastLevel = s.upgrades['auto_cast'] || 0;
        const castSpeedBonus = autoCastLevel > 0 ? (autoCastLevel * 0.005) : 0; 
        setProgress(p => {
          const next = p + (0.05 * speedMult) + castSpeedBonus;
          if (next >= 1) {
            setStatus('WAITING');
            
            // Tutorial Step 3: Wait
            if (s.tutorialStep === 2) {
                setGameState(prev => ({ ...prev, tutorialStep: 3 }));
            }

            return 0;
          }
          return next;
        });
      }
      else if (currentStatus === 'WAITING') {
        // Base bite chance + Bobber Bonus
        let biteChance = 0.02 + (bobberBiteBonus * 0.05);
        if (Math.random() < biteChance) {
          setStatus('BITING');
          soundManager.playSfx('CLICK'); // Bite sound
          soundManager.vibrate(200); // Haptic for bite
          
          // Tutorial Step 4: Reel
          if (s.tutorialStep === 3) {
              setGameState(prev => ({ ...prev, tutorialStep: 4 }));
          }
        }
      }
      else if (currentStatus === 'BITING') {
        if (s.upgrades['auto_reel'] > 0) setStatus('REELING');
      }
      else if (currentStatus === 'REELING') {
        const rodBase = 0.02 + (rodLevel * 0.005);
        const autoReelBonus = autoReelLevel * 0.002; 
        
        if (ticks % 5 === 0) soundManager.playSfx('REEL');

        setProgress(p => {
          const next = p + ((rodBase + autoReelBonus) * speedMult);
          if (next >= 1) {
            finishCatch(currentCombo); 
            return 0;
          }
          return next;
        });
      }
      else if (currentStatus === 'IDLE') {
        if (s.upgrades['auto_cast'] > 0) setStatus('CASTING');
      }

    }, tickRate);
    return () => clearInterval(timer);
  }, [appPhase]); 

  // --- ACTIONS ---

  const handleSceneClick = (e: React.MouseEvent) => {
    if (showMapSelector) {
        setShowMapSelector(false);
        soundManager.playSfx('CLICK');
        return;
    }

    if (status === 'IDLE') {
       setStatus('CASTING');
       soundManager.playSfx('CAST');
       // Tutorial Step 2: Cast done -> Wait (handled in loop)
       if (gameState.tutorialStep === 1) { // Clicked Intro
           setGameState(prev => ({ ...prev, tutorialStep: 2 }));
       } else if (gameState.tutorialStep === 2) {
           // Wait for loop to change status
       }

    } else if (status === 'WAITING') {
        // Foolproofing: Clicked too early
        soundManager.playSfx('ERROR');
        spawnParticles(1, 50, 40, '#ef4444', 'TEXT', '太早了!');
    } else if (status === 'BITING') {
      setStatus('REELING');
    } else if (status === 'REELING') {
      setProgress(p => Math.min(p + 0.1, 1));
    }
  };

  const finishCatch = (currentLoopCombo?: number) => {
    soundManager.playSfx('CATCH');
    const now = Date.now();
    const timeSinceLast = now - lastCatchTime;
    
    if (timeSinceLast < 8000) {
       setCombo(c => Math.min(c + 1, 10)); 
    } else {
       setCombo(1); 
    }
    setLastCatchTime(now);

    // PRE-CALCULATE FISH to trigger side effects (Shake/Vibrate) before state update
    const s = stateRef.current;
    const luck = s.upgrades['bait_luck'] || 0;
    const safetyLevel = s.upgrades['life_jacket'] || 0;
    const preFish = getFish(luck, s.gameTime, s.activeLocation, s.activeBaitId, s.weather, safetyLevel);
    const fishDef = FISH_TYPES.find(t => t.id === preFish.typeId);
    
    // Impact Feedback Logic
    if (fishDef && (fishDef.rarity === 'Legendary' || fishDef.rarity === 'Mythic')) {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500); // Shake duration
        soundManager.vibrate([100, 50, 100, 50, 200]); // Heavy pattern
    } else {
        soundManager.vibrate(100); // Light pattern
    }

    setGameState(prev => {
      // NOTE: We regenerate fish here to be 100% consistent with the update closure, 
      // or we could use the preFish. For simplicity/consistency with previous logic, we use preFish logic inside.
      // Actually, let's just use the `preFish` we generated to ensure visual sync.
      
      const fish = preFish; // Use the one we calculated for effects
      
      const isTreasure = fishDef?.rarity === 'Treasure';
      const rarity = fishDef ? fishDef.rarity : 'Common';
      const name = fishDef ? fishDef.name : 'Unknown';

      // --- VISUAL FEEDBACK (Replaced CatchModal) ---
      const pColor = rarity === 'Common' ? '#94a3b8' : 
                     rarity === 'Rare' ? '#22d3ee' :
                     rarity === 'Epic' ? '#c084fc' :
                     rarity === 'Legendary' ? '#facc15' : 
                     rarity === 'Mythic' ? '#ef4444' : 
                     rarity === 'Junk' ? '#57534e' : '#fbbf24'; 

      spawnParticles(10, 50, 40, pColor, 'SPARKLE');
      spawnParticles(1, 50, 30, '#ffffff', 'TEXT', name);
      if (fish.size) {
          spawnParticles(1, 50, 50, '#ffffff', 'TEXT', `${fish.size}cm`);
      } else if (isTreasure) {
          spawnParticles(1, 50, 50, '#facc15', 'TEXT', '獲得寶石!');
      }

      // Update Bait Charges
      let newBaitInventory = { ...prev.baitInventory };
      let activeId = prev.activeBaitId;
      
      if (activeId && newBaitInventory[activeId] > 0) {
          newBaitInventory[activeId] -= 1;
      }

      // Update Fish Records & Check New Record & New Species
      const records = { ...prev.fishRecords };
      const currentRecord = records[fish.typeId] || { caughtCount: 0, minSize: 99999, maxSize: 0, discovered: false };
      
      // New Species Check
      let isNewSpecies = false;
      if (!currentRecord.discovered) {
          isNewSpecies = true;
          spawnParticles(1, 50, 70, '#facc15', 'TEXT', 'NEW DISCOVERY!');
          spawnParticles(20, 50, 70, '#facc15', 'SPARKLE');
          soundManager.playSfx('LEVEL_UP'); 
      }
      fish.isNewSpecies = isNewSpecies;

      // New Size Record Check (Only for living fish)
      let isNewRecord = false;
      if (fish.size && fish.size > currentRecord.maxSize && !isNewSpecies) { 
         isNewRecord = true;
         spawnParticles(1, 50, 60, '#ef4444', 'TEXT', 'NEW RECORD!');
      }
      fish.isNewRecord = isNewRecord;

      records[fish.typeId] = {
        caughtCount: currentRecord.caughtCount + 1,
        minSize: !fish.size ? 0 : Math.min(currentRecord.minSize, fish.size),
        maxSize: !fish.size ? 0 : Math.max(currentRecord.maxSize, fish.size),
        discovered: true
      };

      // Give Gems for Treasure
      let gemsGained = 0;
      if (isTreasure) {
          gemsGained = Math.floor(Math.random() * 3) + 1;
          spawnParticles(3, 50, 20, '#22d3ee', 'SPARKLE');
      }

      // XP Calculation (Simplified)
      let xpGained = 1;

      // Add to inventory
      let newInventory = [...prev.inventory];
      if (isNewRecord) {
          newInventory = newInventory.map(f => f.typeId === fish.typeId ? { ...f, isNewRecord: false } : f);
      }
      newInventory.push(fish);

      // Tutorial Step 5: Inventory
      let nextStep = prev.tutorialStep;
      if (prev.tutorialStep === 4) nextStep = 5;

      return {
        ...prev,
        xp: prev.xp + xpGained,
        gems: prev.gems + gemsGained,
        baitInventory: newBaitInventory,
        activeBaitId: activeId,
        stats: { ...prev.stats, totalFishCaught: prev.stats.totalFishCaught + 1 },
        fishRecords: records,
        inventory: newInventory,
        tutorialStep: nextStep
      };
    });
    setStatus('IDLE');
  };

  const sellFish = (uid: string, showEffects = true) => {
    setGameState(prev => {
      let fishPrice = 0;
      let newInventory = prev.inventory;
      let newAquarium = prev.aquarium;
      let typeId = '';

      const invFish = prev.inventory.find(f => f.uid === uid);
      if (invFish) {
        fishPrice = invFish.price;
        typeId = invFish.typeId;
        newInventory = prev.inventory.filter(f => f.uid !== uid);
      } else {
        const tankFish = prev.aquarium.find(f => f.uid === uid);
        if (tankFish) {
          fishPrice = tankFish.price;
          typeId = tankFish.typeId;
          newAquarium = prev.aquarium.filter(f => f.uid !== uid);
        }
      }

      if (fishPrice > 0) {
        if (showEffects) soundManager.playSfx('SELL');
        
        const finalPrice = fishPrice; // No multiplier
        
        if (showEffects) {
           spawnParticles(1, 90, 10, '#facc15', 'TEXT', `+${formatNumber(finalPrice)}`);
        }

        // Tutorial Complete
        let nextStep = prev.tutorialStep;
        if (prev.tutorialStep === 5) nextStep = 0; // Finish

        return {
          ...prev,
          money: prev.money + finalPrice,
          inventory: newInventory,
          aquarium: newAquarium,
          stats: { ...prev.stats, totalMoneyEarned: prev.stats.totalMoneyEarned + finalPrice },
          tutorialStep: nextStep
        };
      }
      return prev;
    });
  };

  const moveFishToTank = (uid: string) => {
    soundManager.playSfx('CLICK');
    setGameState(prev => {
      const fish = prev.inventory.find(f => f.uid === uid);
      if (!fish) return prev;
      
      const type = FISH_TYPES.find(t => t.id === fish.typeId);
      // Illegal to tank junk
      if (type?.rarity === 'Junk' || type?.rarity === 'Treasure') {
          spawnParticles(1, 50, 50, '#ef4444', 'TEXT', '無法放入!');
          return prev;
      }

      const tankLevel = prev.upgrades['tank_size'] || 0;
      const capacity = getTankCapacity(tankLevel);
      if (prev.aquarium.length >= capacity) return prev; 
      
      spawnParticles(5, 50, 80, '#22d3ee', 'SPARKLE');
      
      // Tutorial Complete
      let nextStep = prev.tutorialStep;
      if (prev.tutorialStep === 5) nextStep = 0; // Finish

      return {
        ...prev,
        inventory: prev.inventory.filter(f => f.uid !== uid),
        aquarium: [...prev.aquarium, fish],
        tutorialStep: nextStep
      };
    });
  };

  const moveFishToInventory = (uid: string) => {
      soundManager.playSfx('CLICK');
      setGameState(prev => {
          const fish = prev.aquarium.find(f => f.uid === uid);
          if (!fish) return prev;

          spawnParticles(5, 50, 80, '#94a3b8', 'SPARKLE');
          return {
              ...prev,
              aquarium: prev.aquarium.filter(f => f.uid !== uid),
              inventory: [...prev.inventory, fish]
          };
      });
  };

  const sellAll = () => {
    soundManager.playSfx('SELL');
    setGameState(prev => {
      const saleableItems = prev.inventory;
      const total = saleableItems.reduce((sum, f) => sum + f.price, 0);
      
      if (total > 0) spawnParticles(1, 90, 10, '#facc15', 'TEXT', `+${formatNumber(total)}`);

      // Tutorial Complete
      let nextStep = prev.tutorialStep;
      if (prev.tutorialStep === 5) nextStep = 0; // Finish

      return {
        ...prev,
        money: prev.money + total,
        inventory: [],
        stats: { ...prev.stats, totalMoneyEarned: prev.stats.totalMoneyEarned + total },
        tutorialStep: nextStep
      };
    });
  };

  const buyUpgrade = (id: string) => {
    const def = UPGRADES.find(u => u.id === id);
    if (!def) return;
    const currentLevel = gameState.upgrades[id] || 0;
    const cost = getUpgradeCost(def, currentLevel);
    if ((gameState.money >= cost || isDev) && currentLevel < def.maxLevel) {
      soundManager.playSfx('LEVEL_UP');
      // Dev money check: no deduction if dev
      const newMoney = isDev ? gameState.money : gameState.money - cost;
      setGameState(prev => ({ ...prev, money: newMoney, upgrades: { ...prev.upgrades, [id]: currentLevel + 1 } }));
      spawnParticles(5, 50, 50, '#fbbf24', 'SPARKLE');
    } else {
      soundManager.playSfx('ERROR');
    }
  };

  const buyBait = (id: string) => {
    const bait = BAITS.find(b => b.id === id);
    if (!bait) return;
    if (gameState.money >= bait.cost || isDev) {
        soundManager.playSfx('CLICK');
        setGameState(prev => {
            const currentAmount = prev.baitInventory[id] || 0;
            const nextActiveId = prev.activeBaitId === null ? id : prev.activeBaitId;
            const newMoney = isDev ? prev.money : prev.money - bait.cost;

            return { 
                ...prev, 
                money: newMoney, 
                baitInventory: { ...prev.baitInventory, [id]: currentAmount + bait.charges },
                activeBaitId: nextActiveId
            }
        });
        spawnParticles(5, 50, 50, '#10b981', 'SPARKLE');
    } else {
        soundManager.playSfx('ERROR');
    }
  };

  const equipBait = (id: string) => {
      soundManager.playSfx('CLICK');
      setGameState(prev => ({
          ...prev,
          activeBaitId: id
      }));
  };

  const buyBobber = (id: string) => {
      const bobber = BOBBERS.find(b => b.id === id);
      if(!bobber) return;
      if (gameState.money >= bobber.cost || isDev) {
          soundManager.playSfx('LEVEL_UP');
          setGameState(prev => ({
              ...prev,
              money: isDev ? prev.money : prev.money - bobber.cost,
              unlockedBobbers: [...prev.unlockedBobbers, id],
              activeBobberId: id
          }));
          spawnParticles(15, 50, 50, bobber.iconColor, 'SPARKLE');
      } else {
          soundManager.playSfx('ERROR');
      }
  };

  const equipBobber = (id: string) => {
      soundManager.playSfx('CLICK');
      setGameState(prev => ({ ...prev, activeBobberId: id }));
  };

  const buySkin = (id: string) => {
      const skin = AQUARIUM_SKINS.find(s => s.id === id);
      if(!skin) return;
      if (gameState.gems >= skin.costGems || isDev) {
          soundManager.playSfx('LEVEL_UP');
          setGameState(prev => ({
              ...prev,
              gems: isDev ? prev.gems : prev.gems - skin.costGems,
              unlockedSkins: [...prev.unlockedSkins, id],
              activeSkinId: id
          }));
          spawnParticles(20, 50, 50, '#22d3ee', 'SPARKLE');
      } else {
          soundManager.playSfx('ERROR');
      }
  };

  const equipSkin = (id: string) => {
      soundManager.playSfx('CLICK');
      setGameState(prev => ({ ...prev, activeSkinId: id }));
  };

  const cycleBait = () => {
      soundManager.playSfx('CLICK');
      setGameState(prev => {
          const baitIds = BAITS.map(b => b.id);
          const ownedBaits = baitIds.filter(id => (prev.baitInventory[id] || 0) > 0);
          
          if (ownedBaits.length === 0) return prev;

          let currentIndex = -1;
          if (prev.activeBaitId) {
              currentIndex = ownedBaits.indexOf(prev.activeBaitId);
          }

          const nextIndex = (currentIndex + 1) % ownedBaits.length;
          const nextBaitId = ownedBaits[nextIndex];

          spawnParticles(1, 50, 20, '#10b981', 'TEXT', BAITS.find(b=>b.id===nextBaitId)?.name);

          return {
              ...prev,
              activeBaitId: nextBaitId
          };
      });
  };

  const unlockLocation = (id: string) => {
    const loc = LOCATIONS.find(l => l.id === id);
    if (!loc) return;
    
    // Currency Logic
    if (loc.currency === 'GEMS') {
        if ((gameState.gems >= loc.cost || isDev) && !gameState.unlockedLocations.includes(loc.id as any)) {
            soundManager.playSfx('LEVEL_UP');
            const newGems = isDev ? gameState.gems : gameState.gems - loc.cost;
            setGameState(prev => ({ ...prev, gems: newGems, unlockedLocations: [...prev.unlockedLocations, loc.id as any] }));
            spawnParticles(15, 50, 50, '#a855f7', 'SPARKLE');
        } else {
            soundManager.playSfx('ERROR');
        }
        return;
    }

    // Default Money Logic
    if ((gameState.money >= loc.cost || isDev) && !gameState.unlockedLocations.includes(loc.id as any)) {
        soundManager.playSfx('LEVEL_UP');
        const newMoney = isDev ? gameState.money : gameState.money - loc.cost;
        setGameState(prev => ({ ...prev, money: newMoney, unlockedLocations: [...prev.unlockedLocations, loc.id as any] }));
        spawnParticles(15, 50, 50, '#a855f7', 'SPARKLE');
    } else {
        soundManager.playSfx('ERROR');
    }
  };

  const switchLocation = (id: string) => {
      soundManager.playSfx('CLICK');
      setGameState(prev => ({ ...prev, activeLocation: id as any }));
      setShowMapSelector(false);
  };

  const tankCapacity = getTankCapacity(gameState.upgrades['tank_size'] || 0);
  const isTankFull = gameState.aquarium.length >= tankCapacity;

  if (appPhase === 'START') {
    return <StartScreen onStart={goToLogin} />;
  }

  if (appPhase === 'LOGIN') {
      return (
        <LoginScreen 
            onLogin={(username, isDev, displayName) => handleLogin(username, isDev, displayName)} 
            onGuestLogin={handleGuestLogin}
        />
      );
  }

  const displayActiveBait = gameState.activeBaitId ? {
      id: gameState.activeBaitId,
      chargesRemaining: gameState.baitInventory[gameState.activeBaitId] || 0
  } : null;

  return (
    <Layout 
      money={gameState.money} 
      gems={gameState.gems}
      level={Math.floor(Math.sqrt(gameState.xp))}
      activeTab={activeTab}
      onTabChange={(tab) => { soundManager.playSfx('CLICK'); setActiveTab(tab); }}
      onOpenProfile={() => { soundManager.playSfx('CLICK'); setShowProfile(true); }}
      playerAvatar={gameState.playerAvatar}
      playerName={gameState.playerName}
      isShaking={isShaking}
    >
      {/* Interactive Tutorial Overlay */}
      {gameState.tutorialStep > 0 && (
          <TutorialOverlay 
            step={gameState.tutorialStep} 
            onNext={() => setGameState(prev => ({...prev, tutorialStep: 2}))} 
          />
      )}

      {/* 
        CONDITIONAL LAYOUT RENDER:
        Only show FishingScene if tab is INVENTORY.
        Otherwise, render the specific full-page components (Shop/Aquarium).
      */}
      
      {activeTab === 'INVENTORY' ? (
        <>
          {/* Top Half: The Zen Scene */}
          <div className="relative p-0 bg-slate-900 border-b-4 border-black shrink-0 z-10">
            <FishingScene 
              status={status} 
              progress={progress} 
              onClick={handleSceneClick}
              dayTime={gameState.gameTime}
              location={gameState.activeLocation}
              activeBait={displayActiveBait}
              activeBobberId={gameState.activeBobberId}
              onSwitchLocation={() => setShowMapSelector(!showMapSelector)}
              onCycleBait={cycleBait}
              particles={particles}
              combo={combo}
              weather={gameState.weather}
            />
            
            {/* Map Selector Modal */}
            {showMapSelector && (
                <div className="absolute inset-0 bg-black/80 z-40 flex items-center justify-center p-4">
                    <div className="bg-slate-800 border-4 border-slate-600 p-2 w-full max-w-xs space-y-2 rounded shadow-2xl animate-fade-in max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-center text-yellow-400 font-bold mb-2">選擇釣點</h3>
                        {gameState.unlockedLocations.map(locId => {
                            const locDef = LOCATIONS.find(l => l.id === locId);
                            if(!locDef) return null;
                            const isActive = locId === gameState.activeLocation;
                            return (
                                <button
                                    key={locId}
                                    onClick={() => switchLocation(locId)}
                                    className={`w-full p-2 text-left border-2 rounded ${isActive ? 'bg-indigo-900 border-indigo-500 text-white' : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`}
                                >
                                    <div className="font-bold text-sm">{locDef.name}</div>
                                    <div className="text-[10px] opacity-70">{locDef.description}</div>
                                </button>
                            )
                        })}
                        <button onClick={() => setShowMapSelector(false)} className="w-full mt-2 text-xs text-slate-400 py-2">取消</button>
                    </div>
                </div>
            )}

            {/* Offline Earnings Modal */}
            {offlineEarnings > 0 && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                <PixelCard className="w-full max-w-xs p-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)] animate-bounce-small">
                  <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold text-yellow-400">歡迎回來!</h2>
                    <p className="text-sm text-slate-300">在你休息的期間，<br/>自動釣魚系統為你累積了收益。</p>
                    <div className="py-4 bg-slate-800 rounded border border-slate-600 flex justify-center items-center gap-2">
                        <span className="text-2xl font-mono text-green-400 font-bold">+{formatNumber(offlineEarnings)}</span>
                        <Coins size={24} className="text-green-400" />
                    </div>
                    <button 
                      onClick={() => { setOfflineEarnings(0); soundManager.playSfx('SELL'); }}
                      className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 rounded border-b-4 border-yellow-800 active:border-b-0 active:translate-y-1 transition-all"
                    >
                      收下金幣
                    </button>
                  </div>
                </PixelCard>
              </div>
            )}
          </div>

          {/* Bottom Half: Inventory */}
          <div className="flex-1 overflow-hidden bg-slate-950 p-2 flex flex-col min-h-0 relative z-0">
             <Inventory 
                items={gameState.inventory} 
                tankFull={isTankFull}
                onSell={(id) => sellFish(id, true)} 
                onSellAll={sellAll}
                onKeep={moveFishToTank}
              />
          </div>
        </>
      ) : (
        /* Full Screen Views for Other Tabs */
        <div className="flex-1 h-full overflow-hidden bg-slate-950 flex flex-col min-h-0 relative z-0">
            {activeTab === 'AQUARIUM' && (
              <div className="h-full p-2">
                <Aquarium 
                  fish={gameState.aquarium}
                  tankLevel={gameState.upgrades['tank_size'] || 0}
                  activeSkinId={gameState.activeSkinId}
                  onSell={(id) => sellFish(id, true)}
                  onRetrieve={moveFishToInventory}
                />
              </div>
            )}
            {activeTab === 'SHOP' && (
              <Shop 
                state={gameState} 
                onBuyUpgrade={buyUpgrade} 
                onBuyBait={buyBait}
                onEquipBait={equipBait}
                onBuyBobber={buyBobber}
                onEquipBobber={equipBobber}
                onBuySkin={buySkin}
                onEquipSkin={equipSkin}
                onUnlockLocation={unlockLocation}
              />
            )}
        </div>
      )}

      {/* Global Modals */}
      {showProfile && (
          <ProfileModal 
            onClose={() => setShowProfile(false)}
            gameState={gameState}
            onOpenAlmanac={() => { setShowProfile(false); setShowAlmanac(true); }}
            onSelectAvatar={changeAvatar}
            onChangeName={changeName}
            onResetSave={handleResetSave}
            onLogout={handleLogout}
            onOpenTutorial={() => setGameState(prev => ({ ...prev, tutorialStep: 1 }))}
          />
      )}
      {showAlmanac && (
          <AlmanacModal 
            onClose={() => setShowAlmanac(false)}
            records={gameState.fishRecords}
            unlockedLocations={gameState.unlockedLocations}
          />
      )}

    </Layout>
  );
};

export default App;