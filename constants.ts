// 常數定義文件：包含遊戲數據配置，如魚類列表、地點、裝備數值與稀有度機率。

import { BaitDef, BobberDef, FishType, LocationDef, Rarity, UpgradeDef, AquariumSkinDef } from './types';

export const RARITY_INFO: Record<Rarity, { color: string, label: string, chance: number }> = {
  'Junk':      { color: 'text-stone-500', label: '雜物', chance: 0.15 },
  'Common':    { color: 'text-slate-400', label: '普通', chance: 0.50 },
  'Rare':      { color: 'text-cyan-400', label: '稀有', chance: 0.20 },
  'Epic':      { color: 'text-purple-400', label: '史詩', chance: 0.08 },
  'Legendary': { color: 'text-yellow-400', label: '傳說', chance: 0.03 },
  'Mythic':    { color: 'text-red-500', label: '神話', chance: 0.01 },
  'Treasure':  { color: 'text-amber-300', label: '寶藏', chance: 0.03 },
};

export const LOCATIONS: LocationDef[] = [
  { id: 'pond', name: '寧靜池塘', cost: 0, description: '冒險的起點。適合初學者練習。', bgGradient: 'from-green-800 via-teal-900 to-slate-900' },
  { id: 'river', name: '激流溪谷', cost: 3000, description: '充滿靈氣的湍急水域。', bgGradient: 'from-blue-700 via-cyan-800 to-slate-900' },
  { id: 'ocean', name: '深藍大海', cost: 20000, description: '巨獸與古代遺跡的沉睡之地。', bgGradient: 'from-indigo-900 via-blue-950 to-black' },
  { id: 'swamp', name: '神秘沼澤', cost: 100000, description: '生死交界的迷霧。', bgGradient: 'from-fuchsia-900 via-purple-950 to-black' },
  { id: 'deep_sea', name: '深淵海溝', cost: 300000, description: '吞噬光明的永夜領域。', bgGradient: 'from-black via-slate-900 to-black' },
  { id: 'volcano', name: '熔岩火山口', cost: 600000, description: '流動的岩漿與高熱，生命的禁區。', bgGradient: 'from-red-900 via-orange-900 to-slate-900' },
  { id: 'sky', name: '天空之城', cost: 1000000, description: '漂浮於雲端，最接近星辰的傳說之地。', bgGradient: 'from-sky-300 via-blue-400 to-indigo-200' },
];

export const BOBBERS: BobberDef[] = [
  { id: 'classic', name: '經典紅白', description: '最標準的浮標，沒有特殊功能。', cost: 0, biteTimeBonus: 0, lureSpeedBonus: 0, iconColor: '#ef4444' },
  { id: 'duck', name: '黃色小鴨', description: '即使在暴風雨中也能保持穩定。', cost: 2000, biteTimeBonus: 0.05, lureSpeedBonus: 0.05, iconColor: '#facc15' },
  { id: 'burger', name: '大漢堡', description: '散發著美味的香氣，能加快魚兒咬鉤。', cost: 5000, biteTimeBonus: 0.15, lureSpeedBonus: 0, iconColor: '#d97706' },
  { id: 'skull', name: '骷髏頭', description: '看起來很嚇人，但能威嚇大魚乖乖就範。', cost: 15000, biteTimeBonus: 0, lureSpeedBonus: 0.15, iconColor: '#e2e8f0' },
  { id: 'bulb', name: '深海燈泡', description: '發出微光，在黑暗中特別有效。', cost: 50000, biteTimeBonus: 0.10, lureSpeedBonus: 0.10, iconColor: '#22d3ee' },
];

export const BAITS: BaitDef[] = [
  { id: 'worm', name: '蚯蚓', description: '便宜又實用，適合新手。', cost: 10, charges: 10, luckBonus: 0, rerollChance: 0 },
  { id: 'cricket', name: '蟋蟀', description: '活蹦亂跳的，能吸引稍大的魚。', cost: 50, charges: 10, luckBonus: 0.05, rerollChance: 0.05 },
  { id: 'shrimp', name: '鮮蝦', description: '美味多汁，魚兒難以抗拒。', cost: 200, charges: 5, luckBonus: 0.10, rerollChance: 0.15 },
  { id: 'squid_meat', name: '魷魚塊', description: '濃郁的氣味，深海魚的最愛。', cost: 500, charges: 5, luckBonus: 0.20, rerollChance: 0.10 },
  { id: 'star_dust', name: '星塵粉', description: '來自宇宙的神秘粉末，能引來奇蹟。', cost: 5, charges: 1, luckBonus: 0.50, rerollChance: 0.50 },
  { id: 'basketball_bait', name: '迷你籃球', description: '為什麼魚會吃這個？沒人知道。', cost: 23, charges: 1, luckBonus: 0.23, rerollChance: 1.0 },
];

export const UPGRADES: UpgradeDef[] = [
  { id: 'rod_speed', name: '捲線速度', type: 'SPEED', description: '加快收竿速度，減少與魚搏鬥的時間。', baseCost: 100, costMult: 1.5, maxLevel: 10 },
  { id: 'auto_cast', name: '自動拋竿', type: 'AUTO_CAST', description: '閒置時自動進行拋竿動作。', baseCost: 500, costMult: 2.0, maxLevel: 5 },
  { id: 'auto_reel', name: '自動收線', type: 'AUTO_REEL', description: '魚上鉤後自動捲線。', baseCost: 1000, costMult: 2.0, maxLevel: 5 },
  { id: 'tank_size', name: '魚缸擴充', type: 'TANK_SIZE', description: '增加水族箱的容量。', baseCost: 200, costMult: 1.4, maxLevel: 20 },
  { id: 'offline_storage', name: '離線收益', type: 'OFFLINE', description: '增加離線時自動獲取收益的時間上限(小時)。', baseCost: 1000, costMult: 1.8, maxLevel: 8 },
  { id: 'bait_luck', name: '幸運浮標', type: 'LUCK', description: '永久提升釣到稀有魚的機率。', baseCost: 2000, costMult: 1.6, maxLevel: 10 },
  { id: 'life_jacket', name: '救生衣', type: 'SAFETY', description: '在暴風雨中也能安全釣魚，並增加運氣。', baseCost: 5000, costMult: 1.5, maxLevel: 5 },
];

export const AQUARIUM_SKINS: AquariumSkinDef[] = [
  { id: 'default', name: '標準魚缸', description: '乾淨、明亮，適合大多數魚類。', costGems: 0, bgGradient: 'linear-gradient(to bottom, #06b6d4, #083344)' },
  { id: 'coral', name: '珊瑚礁', description: '五彩斑斕的熱帶風情。', costGems: 10, bgGradient: 'linear-gradient(to bottom, #22d3ee, #0e7490)', decorElement: 'coral' },
  { id: 'river_stones', name: '溪流造景', description: '清澈的河水與圓潤的石頭。', costGems: 20, bgGradient: 'linear-gradient(to bottom, #4ade80, #14532d)', decorElement: 'river_stones' },
  { id: 'roots', name: '紅樹林', description: '盤根錯節的神秘根系。', costGems: 30, bgGradient: 'linear-gradient(to bottom, #a8a29e, #292524)', decorElement: 'roots', requiredLocation: 'swamp' },
  { id: 'grid', name: '數位空間', description: '充滿未來感的虛擬水族箱。', costGems: 50, bgGradient: 'linear-gradient(to bottom, #1e1b4b, #000000)', decorElement: 'grid' },
  { id: 'space', name: '深空', description: '魚兒在星海中遨遊。', costGems: 100, bgGradient: 'linear-gradient(to bottom, #000000, #1e1b4b)', decorElement: 'space', requiredLocation: 'sky' },
  { id: 'toy_castle', name: '玩具城堡', description: '夢幻般的童話世界。', costGems: 40, bgGradient: 'linear-gradient(to bottom, #f9a8d4, #db2777)', decorElement: 'toy_castle' },
];

export const FISH_TYPES: FishType[] = [
    // === 雜物 ===
    { id: 'boot', name: '破靴子', rarity: 'Junk', basePrice: 1, color: '#57534e', activeTime: 'All', locations: ['pond', 'river', 'swamp'] },
    { id: 'plastic_bottle', name: '塑膠瓶', rarity: 'Junk', basePrice: 1, color: '#38bdf8', activeTime: 'All', locations: ['pond', 'ocean'] },
    { id: 'ghost_net', name: '廢棄漁網', rarity: 'Junk', basePrice: 5, color: '#155e75', activeTime: 'All', locations: ['ocean', 'deep_sea'] },
    { id: 'pumice_stone', name: '浮石', rarity: 'Junk', basePrice: 10, color: '#d6d3d1', activeTime: 'All', locations: ['volcano'] },
    { id: 'space_debris', name: '太空垃圾', rarity: 'Junk', basePrice: 50, color: '#64748b', activeTime: 'All', locations: ['sky'] },

    // === 寶藏 ===
    { id: 'chest', name: '寶箱', rarity: 'Treasure', basePrice: 500, color: '#fbbf24', activeTime: 'All', locations: ['ocean', 'deep_sea', 'swamp'] },
    { id: 'star_fragment', name: '星辰碎片', rarity: 'Treasure', basePrice: 1000, color: '#e0f2fe', activeTime: 'Night', locations: ['sky'] },

    // === 池塘 ===
    { id: 'minnow', name: '米諾魚', rarity: 'Common', basePrice: 5, color: '#94a3b8', activeTime: 'Day', locations: ['pond'], minSize: 2, maxSize: 8 },
    { id: 'goldfish', name: '金魚', rarity: 'Common', basePrice: 8, color: '#fb923c', activeTime: 'All', locations: ['pond'], minSize: 3, maxSize: 10 },
    { id: 'neon_tetra', name: '日光燈魚', rarity: 'Rare', basePrice: 25, color: '#22d3ee', activeTime: 'All', locations: ['pond'], minSize: 1, maxSize: 4 },
    { id: 'koi', name: '錦鯉', rarity: 'Legendary', basePrice: 200, color: '#f87171', activeTime: 'Day', locations: ['pond'], minSize: 20, maxSize: 60 },
    { id: 'carp', name: '鯉魚', rarity: 'Common', basePrice: 10, color: '#b91c1c', activeTime: 'All', locations: ['pond', 'river'], minSize: 20, maxSize: 80 },
    
    // === 河流 ===
    { id: 'perch', name: '河鱸', rarity: 'Common', basePrice: 15, color: '#84cc16', activeTime: 'All', locations: ['river'], minSize: 15, maxSize: 40 },
    { id: 'crayfish', name: '小龍蝦', rarity: 'Common', basePrice: 20, color: '#ef4444', activeTime: 'All', locations: ['river', 'pond'], minSize: 5, maxSize: 15 },
    { id: 'trout', name: '虹鱒', rarity: 'Rare', basePrice: 60, color: '#86efac', activeTime: 'Day', locations: ['river'], minSize: 25, maxSize: 70 },
    { id: 'salmon', name: '鮭魚', rarity: 'Rare', basePrice: 80, color: '#f43f5e', activeTime: 'Day', locations: ['river'], minSize: 40, maxSize: 90 },
    { id: 'arowana', name: '紅龍魚', rarity: 'Legendary', basePrice: 500, color: '#b91c1c', activeTime: 'Night', locations: ['river', 'swamp'], minSize: 50, maxSize: 100 },

    // === 沼澤 ===
    { id: 'mudskipper', name: '彈塗魚', rarity: 'Common', basePrice: 25, color: '#78350f', activeTime: 'Day', locations: ['swamp'], minSize: 5, maxSize: 15 },
    { id: 'catfish', name: '鯰魚', rarity: 'Rare', basePrice: 70, color: '#475569', activeTime: 'Night', locations: ['swamp', 'river'], minSize: 30, maxSize: 120 },
    { id: 'piranha', name: '食人魚', rarity: 'Epic', basePrice: 150, color: '#94a3b8', activeTime: 'All', locations: ['swamp'], minSize: 10, maxSize: 30 },
    { id: 'mitten_crab', name: '大閘蟹', rarity: 'Common', basePrice: 40, color: '#57534e', activeTime: 'Night', locations: ['swamp'], minSize: 5, maxSize: 10 },
    { id: 'hydra', name: '九頭蛇', rarity: 'Mythic', basePrice: 2000, color: '#047857', activeTime: 'Night', locations: ['swamp'], minSize: 100, maxSize: 500 },

    // === 海洋 ===
    { id: 'sardine', name: '沙丁魚', rarity: 'Common', basePrice: 12, color: '#94a3b8', activeTime: 'Day', locations: ['ocean'], minSize: 10, maxSize: 25 },
    { id: 'crab', name: '螃蟹', rarity: 'Common', basePrice: 30, color: '#f87171', activeTime: 'All', locations: ['ocean'], minSize: 5, maxSize: 20 },
    { id: 'lobster', name: '龍蝦', rarity: 'Rare', basePrice: 100, color: '#dc2626', activeTime: 'Night', locations: ['ocean'], minSize: 20, maxSize: 50 },
    { id: 'tuna', name: '鮪魚', rarity: 'Epic', basePrice: 300, color: '#1e3a8a', activeTime: 'Day', locations: ['ocean'], minSize: 80, maxSize: 250 },
    { id: 'shark', name: '大白鯊', rarity: 'Legendary', basePrice: 800, color: '#64748b', activeTime: 'All', locations: ['ocean'], minSize: 300, maxSize: 600 },
    { id: 'king_crab', name: '帝王蟹', rarity: 'Epic', basePrice: 250, color: '#991b1b', activeTime: 'All', locations: ['ocean', 'deep_sea'], minSize: 50, maxSize: 100 },
    { id: 'tiger_prawn', name: '虎蝦', rarity: 'Common', basePrice: 25, color: '#fdba74', activeTime: 'All', locations: ['ocean'], minSize: 10, maxSize: 20 },
    { id: 'lion_fish', name: '獅子魚', rarity: 'Rare', basePrice: 100, color: '#fde047', activeTime: 'All', locations: ['ocean'], minSize: 20, maxSize: 40 },
    { id: 'humphead', name: '蘇眉魚', rarity: 'Epic', basePrice: 400, color: '#06b6d4', activeTime: 'Day', locations: ['ocean'], minSize: 50, maxSize: 150 },
    { id: 'leviathan', name: '利維坦', rarity: 'Mythic', basePrice: 6666, color: '#4c1d95', activeTime: 'All', locations: ['ocean', 'deep_sea'], weatherPreference: ['Storm'], minSize: 800, maxSize: 2000 },

    // === 深海 ===
    { id: 'blobfish', name: '水滴魚', rarity: 'Rare', basePrice: 120, color: '#fda4af', activeTime: 'All', locations: ['deep_sea'], minSize: 20, maxSize: 40 },
    { id: 'lantern_fish', name: '燈籠魚', rarity: 'Common', basePrice: 60, color: '#0e7490', activeTime: 'All', locations: ['deep_sea'], minSize: 10, maxSize: 30 },
    { id: 'giant_squid', name: '大王烏賊', rarity: 'Mythic', basePrice: 3000, color: '#b91c1c', activeTime: 'All', locations: ['deep_sea'], minSize: 500, maxSize: 1200 },
    { id: 'oarfish', name: '皇帶魚', rarity: 'Legendary', basePrice: 1000, color: '#e2e8f0', activeTime: 'All', locations: ['deep_sea'], minSize: 300, maxSize: 800 },
    { id: 'viperfish', name: '蝰魚', rarity: 'Epic', basePrice: 200, color: '#581c87', activeTime: 'All', locations: ['deep_sea'], minSize: 20, maxSize: 50 },
    { id: 'goblin_shark', name: '哥布林鯊', rarity: 'Legendary', basePrice: 900, color: '#f43f5e', activeTime: 'All', locations: ['deep_sea'], minSize: 200, maxSize: 400 },
    { id: 'coelacanth', name: '腔棘魚', rarity: 'Mythic', basePrice: 2500, color: '#1e3a8a', activeTime: 'All', locations: ['deep_sea'], minSize: 100, maxSize: 200 },
    { id: 'void_eater', name: '虛空吞噬者', rarity: 'Mythic', basePrice: 5000, color: '#4c1d95', activeTime: 'All', locations: ['deep_sea'], minSize: 50, maxSize: 150 },
    { id: 'skeleton_fish', name: '骸骨魚', rarity: 'Epic', basePrice: 180, color: '#e5e5e5', activeTime: 'All', locations: ['deep_sea', 'swamp'], minSize: 30, maxSize: 60 },

    // === 火山 ===
    { id: 'magma_guppy', name: '熔岩孔雀魚', rarity: 'Common', basePrice: 40, color: '#f97316', activeTime: 'All', locations: ['volcano'], minSize: 2, maxSize: 5 },
    { id: 'ember_tetra', name: '餘燼燈魚', rarity: 'Rare', basePrice: 90, color: '#7f1d1d', activeTime: 'All', locations: ['volcano'], minSize: 2, maxSize: 6 },
    { id: 'obsidian_bass', name: '黑曜石鱸魚', rarity: 'Rare', basePrice: 110, color: '#451a03', activeTime: 'All', locations: ['volcano'], minSize: 20, maxSize: 50 },
    { id: 'fire_dragon', name: '火龍魚', rarity: 'Mythic', basePrice: 4000, color: '#7f1d1d', activeTime: 'All', locations: ['volcano'], minSize: 100, maxSize: 300 },
    { id: 'phoenix_koi', name: '鳳凰錦鯉', rarity: 'Legendary', basePrice: 1500, color: '#fbbf24', activeTime: 'Day', locations: ['volcano'], minSize: 40, maxSize: 80 },

    // === 天空 ===
    { id: 'flying_fish', name: '飛魚', rarity: 'Common', basePrice: 50, color: '#0ea5e9', activeTime: 'Day', locations: ['sky', 'ocean'], minSize: 15, maxSize: 35 },
    { id: 'cloud_ray', name: '雲魟', rarity: 'Rare', basePrice: 150, color: '#e0f2fe', activeTime: 'Day', locations: ['sky'], minSize: 50, maxSize: 120 },
    { id: 'angel_fish', name: '天使魚', rarity: 'Epic', basePrice: 350, color: '#facc15', activeTime: 'Day', locations: ['sky'], minSize: 10, maxSize: 25 },
    { id: 'star_whale', name: '星鯨', rarity: 'Mythic', basePrice: 8888, color: '#312e81', activeTime: 'Night', locations: ['sky'], minSize: 1000, maxSize: 5000 },
    { id: 'wisp_jelly', name: '靈光水母', rarity: 'Legendary', basePrice: 1200, color: '#34d399', activeTime: 'Night', locations: ['sky'], minSize: 20, maxSize: 60 },
    { id: 'solar_discus', name: '日輪魚', rarity: 'Legendary', basePrice: 1300, color: '#f97316', activeTime: 'Day', locations: ['sky'], minSize: 30, maxSize: 50 },
    { id: 'moonfish', name: '月光魚', rarity: 'Rare', basePrice: 130, color: '#c7d2fe', activeTime: 'Night', locations: ['sky'], minSize: 10, maxSize: 20 },
];
