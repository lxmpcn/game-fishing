
import { BaitDef, BobberDef, CatDef, FishType, LocationDef, Rarity, StoryEvent, UpgradeDef, AquariumSkinDef } from './types';

export const RARITY_INFO: Record<Rarity, { color: string, label: string, chance: number }> = {
  'Junk':      { color: 'text-stone-500', label: '雜物', chance: 0.15 },
  'Common':    { color: 'text-slate-400', label: '普通', chance: 0.50 },
  'Rare':      { color: 'text-cyan-400', label: '稀有', chance: 0.20 },
  'Epic':      { color: 'text-purple-400', label: '史詩', chance: 0.08 },
  'Legendary': { color: 'text-yellow-400', label: '傳說', chance: 0.03 },
  'Mythic':    { color: 'text-red-500', label: '神話', chance: 0.01 },
  'Treasure':  { color: 'text-amber-300', label: '寶藏', chance: 0.03 },
};

export const STORY_EVENTS: StoryEvent[] = [
  { 
    id: 'intro', 
    trigger: 'START', 
    title: '生鏽的羅盤', 
    content: '爺爺留下的舊釣竿旁，放著一個指針亂轉的羅盤。\n筆記上寫著：「當水流倒轉，星辰將落入大海。」\n這座平凡的池塘，似乎隱藏著通往某處的秘密。', 
    speaker: 'PLAYER' 
  },
  { 
    id: 'first_catch', 
    trigger: 'CATCH_1', 
    title: '不思議的反應', 
    content: '喵！這條魚...鱗片上有微弱的魔力！\n看來我的猜測是對的，這裡的水域連接著「星界」。\n多釣一些特殊的魚，或許能修復那個羅盤！', 
    speaker: 'SHOPKEEPER' 
  },
  { 
    id: 'rich', 
    trigger: 'EARN_1000', 
    title: '第一桶金', 
    content: '看來你已經掌握了釣魚的訣竅，錢包也鼓起來了呢！\n記得多光顧我的商店。工欲善其事，必先利其器。\n想要釣大魚，裝備可不能馬虎。', 
    speaker: 'SHOPKEEPER' 
  },
  { 
    id: 'unlock_river', 
    trigger: 'UNLOCK_LOCATION', 
    title: '激流的挑戰', 
    content: '羅盤的指針穩定了下來，指向北方的溪谷。\n那裡水流湍急，棲息著力量強大的迴游魚類。\n抓穩你的釣竿，別被魚給拖下水了！', 
    speaker: 'SHOPKEEPER' 
  },
  { 
    id: 'unlock_ocean', 
    trigger: 'UNLOCK_LOCATION', 
    title: '廣闊的藍', 
    content: '終於來到大海了... 空氣中充滿鹹味與未知的氣息。\n羅盤的光芒變得更強了。\n傳說深海中沉睡著守護遺跡的巨獸，必須小心行事。', 
    speaker: 'PLAYER' 
  },
  { 
    id: 'unlock_swamp', 
    trigger: 'UNLOCK_LOCATION', 
    title: '迷霧邊界', 
    content: '喵... 這裡感覺毛毛的。\n這片沼澤是現世與靈界的交匯點。\n這裡的魚類受魔力影響，長相都有點特別...\n如果不小心釣到奇怪的東西，別怪我沒提醒你。', 
    speaker: 'SHOPKEEPER' 
  },
  { 
    id: 'unlock_deep_sea', 
    trigger: 'UNLOCK_LOCATION', 
    title: '永夜深淵', 
    content: '陽光無法觸及的絕對黑暗。\n這裡的生物為了適應虛空，演化出了自體發光的能力。\n羅盤劇烈震動，爺爺筆記裡的「深淵之門」一定就在這。', 
    speaker: 'PLAYER' 
  },
  { 
    id: 'unlock_sky', 
    trigger: 'UNLOCK_LOCATION', 
    title: '星之海', 
    content: '難以置信... 水流竟然違背重力向上流動，連接著雲海。\n這就是傳說中的「天空之城」。\n游動在雲端的，是星光凝聚而成的生命。\n我們終於抵達了旅途的終點。', 
    speaker: 'PLAYER' 
  },
];

export const QUEST_TEMPLATES = {
    pond: [
        { title: "鄰居的請求", giver: "鄰居大嬸", desc: "我家的貓最近胃口不好，只想吃池塘裡的新鮮小魚。", type: 'CATCH_COUNT' },
        { title: "生態調查", giver: "生物老師", desc: "我們需要調查池塘的魚類密度，請幫忙收集數據。", type: 'CATCH_COUNT' },
        { title: "新手訓練", giver: "橘子店長", desc: "想成為大師？先證明你能靠釣魚養活自己吧！", type: 'EARN_MONEY' },
    ],
    river: [
        { title: "激流勇進", giver: "退休漁夫", desc: "這種湍急的溪流才有好魚！釣幾條有活力的上來！", type: 'CATCH_COUNT' },
        { title: "河鮮盛宴", giver: "流浪廚師", desc: "我正在研發一道新菜，需要河裡的稀有食材。", type: 'CATCH_RARITY', targetId: 'Rare' },
        { title: "清理河道", giver: "環保志工", desc: "遊客留下了太多垃圾，請幫忙清理河底的雜物。", type: 'CATCH_RARITY', targetId: 'Junk' },
    ],
    ocean: [
        { title: "海鮮訂單", giver: "豪華餐廳", desc: "今晚有貴賓預訂，我們需要最高級的海鮮食材。", type: 'CATCH_RARITY', targetId: 'Epic' },
        { title: "深藍之謎", giver: "博物館長", desc: "傳說這片海域有古代生物出沒，請帶回樣本。", type: 'CATCH_COUNT' },
        { title: "擴充資金", giver: "船長", desc: "維護這艘船可不便宜，多賺點錢來升級裝備吧！", type: 'EARN_MONEY' },
    ],
    swamp: [
        { title: "巫婆的湯藥", giver: "沼澤女巫", desc: "嘻嘻...我需要一些特殊的魚來熬製我的魔法湯。", type: 'CATCH_COUNT' },
        { title: "迷霧探勘", giver: "冒險家公會", desc: "這片沼澤太危險了，我們需要先鋒部隊去探路。", type: 'EARN_MONEY' },
        { title: "靈魂收集", giver: "神秘聲音", desc: "帶回那些...發光的...靈魂碎片...", type: 'CATCH_RARITY', targetId: 'Rare' },
    ],
    deep_sea: [
        { title: "深淵恐懼", giver: "潛水員", desc: "下面太黑了...我不敢下去，你能幫我看看有什麼嗎？", type: 'CATCH_COUNT' },
        { title: "生物發光", giver: "研究中心", desc: "我們正在研究深海魚的發光原理，需要更多樣本。", type: 'CATCH_RARITY', targetId: 'Epic' },
    ],
    sky: [
        { title: "星塵收集", giver: "占星術士", desc: "星星...正在墜落。收集它們。", type: 'CATCH_COUNT' },
        { title: "雲端漫步", giver: "天使", desc: "這片雲海是神聖的，請保持它的純淨。", type: 'EARN_MONEY' },
    ]
};

export const LOCATIONS: LocationDef[] = [
  { id: 'pond', name: '寧靜池塘', cost: 0, description: '冒險的起點，微弱的魔力反應。', bgGradient: 'from-green-800 via-teal-900 to-slate-900' },
  { id: 'river', name: '激流溪谷', cost: 3000, description: '充滿靈氣的湍急水域。', bgGradient: 'from-blue-700 via-cyan-800 to-slate-900' },
  { id: 'ocean', name: '深藍大海', cost: 20000, description: '巨獸與古代遺跡的沉睡之地。', bgGradient: 'from-indigo-900 via-blue-950 to-black' },
  { id: 'swamp', name: '神秘沼澤', cost: 100000, description: '生死交界的魔法迷霧。', bgGradient: 'from-fuchsia-900 via-purple-950 to-black' },
  { id: 'deep_sea', name: '深淵海溝', cost: 300000, description: '吞噬光明的永夜領域。', bgGradient: 'from-black via-slate-900 to-black' },
  { id: 'sky', name: '天空之城', cost: 1000000, description: '漂浮於雲端，最接近星辰的傳說之地。', bgGradient: 'from-sky-300 via-blue-400 to-indigo-200' },
];

export const BOBBERS: BobberDef[] = [
  { id: 'classic', name: '經典紅白', description: '最標準的浮標，沒有特殊功能。', cost: 0, biteTimeBonus: 0, lureSpeedBonus: 0, iconColor: '#ef4444' },
  { id: 'duck', name: '黃色小鴨', description: '即使在暴風雨中也能保持穩定。', cost: 2000, biteTimeBonus: 0.05, lureSpeedBonus: 0.05, iconColor: '#facc15' },
  { id: 'burger', name: '大漢堡', description: '散發著美味的香氣，能加快魚兒咬鉤。', cost: 5000, biteTimeBonus: 0.15, lureSpeedBonus: 0, iconColor: '#d97706' },
  { id: 'skull', name: '骷髏頭', description: '看起來很嚇人，但能威嚇大魚乖乖就範。', cost: 15000, biteTimeBonus: 0, lureSpeedBonus: 0.15, iconColor: '#e2e8f0' },
  { id: 'bulb', name: '深海燈泡', description: '發出微光，在黑暗中特別有效。', cost: 50000, biteTimeBonus: 0.10, lureSpeedBonus: 0.10, iconColor: '#22d3ee' },
];

export const AQUARIUM_SKINS: AquariumSkinDef[] = [
  { 
    id: 'default', 
    name: '標準深藍', 
    description: '最經典的水族箱背景。', 
    costGems: 0, 
    bgGradient: 'linear-gradient(180deg, rgba(22,78,99,0.2) 0%, rgba(30,58,138,0.6) 100%)' 
  },
  { 
    id: 'river_stone', 
    name: '溪流石景', 
    description: '充滿鵝卵石與流動感的淡水環境。', 
    costGems: 10, 
    bgGradient: 'linear-gradient(180deg, rgba(20,184,166,0.2) 0%, rgba(13,148,136,0.6) 100%)', 
    decorElement: 'river_stones',
    requiredLocation: 'river'
  },
  { 
    id: 'toy_box', 
    name: '玩具城堡', 
    description: '放滿了塑膠城堡和玩具，魚兒的遊樂場。', 
    costGems: 25, 
    bgGradient: 'linear-gradient(180deg, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.4) 100%)', 
    decorElement: 'toy_castle',
    requiredLocation: 'ocean'
  },
  { 
    id: 'swamp_root', 
    name: '沈木秘境', 
    description: '盤根錯節的樹根，適合喜歡陰暗的魚類。', 
    costGems: 40, 
    bgGradient: 'linear-gradient(180deg, rgba(63,98,18,0.3) 0%, rgba(20,83,45,0.8) 100%)', 
    decorElement: 'roots',
    requiredLocation: 'swamp'
  },
  { 
    id: 'cyber', 
    name: '賽博龐克', 
    description: '充滿未來感的霓虹水槽。', 
    costGems: 50, 
    bgGradient: 'linear-gradient(180deg, rgba(88,28,135,0.3) 0%, rgba(46,16,101,0.8) 100%)', 
    decorElement: 'grid',
    requiredLocation: 'deep_sea'
  },
  { 
    id: 'space_station', 
    name: '太空漫遊', 
    description: '彷彿置身於宇宙星河之中。', 
    costGems: 100, 
    bgGradient: 'linear-gradient(180deg, rgba(15,23,42,0.8) 0%, rgba(30,27,75,1) 100%)', 
    decorElement: 'space',
    requiredLocation: 'sky'
  },
];

export const BAITS: BaitDef[] = [
  { id: 'worm', name: '紅蚯蚓', description: '基本的魚餌，稍微增加運氣 (5次)', cost: 50, charges: 5, luckBonus: 0.05, rerollChance: 0.1 },
  { id: 'cricket', name: '大蟋蟀', description: '河魚的最愛 (5次)', cost: 200, charges: 5, luckBonus: 0.10, rerollChance: 0.3 },
  { id: 'shrimp', name: '鮮蝦米', description: '能吸引稀有的海水魚 (5次)', cost: 800, charges: 5, luckBonus: 0.15, rerollChance: 0.5 },
  { id: 'squid_meat', name: '魷魚切片', description: '深海魚類難以抗拒的美味 (5次)', cost: 2000, charges: 5, luckBonus: 0.25, rerollChance: 0.7 },
  { id: 'star_dust', name: '星辰粉末', description: '來自宇宙的塵埃，極度吸引神話生物 (10次)', cost: 5000, charges: 10, luckBonus: 0.50, rerollChance: 0.9 },
];

export const CATS: CatDef[] = [
  { 
    id: 'ginger', 
    name: '橘子', 
    title: '貪吃鬼',
    description: '負責試吃魚獲。水族箱收益 +25%', 
    cost: 1000, 
    bonusType: 'INCOME_MULT', 
    bonusValue: 0.25, 
    color: '#fb923c' 
  },
  { 
    id: 'bolt', 
    name: '閃電', 
    title: '過動兒',
    description: '幫忙收線和備料。操作速度 +20%', 
    cost: 5000, 
    bonusType: 'SPEED_MULT', 
    bonusValue: 0.20, 
    color: '#facc15' 
  },
  { 
    id: 'boss', 
    name: '老大', 
    title: '魚販子',
    description: '負責跟市場殺價。賣魚價格 +20%', 
    cost: 15000, 
    bonusType: 'PRICE_MULT', 
    bonusValue: 0.20, 
    color: '#94a3b8' 
  },
  { 
    id: 'luna', 
    name: '露娜', 
    title: '占星師',
    description: '預測稀有魚出沒位置。運氣 +5%', 
    cost: 50000, 
    bonusType: 'LUCK_FLAT', 
    bonusValue: 0.05, 
    color: '#8b5cf6' 
  },
  { 
    id: 'doc', 
    name: '博士', 
    title: '學者',
    description: '研究魚類生態。獲得經驗值 +50%', 
    cost: 100000, 
    bonusType: 'XP_MULT', 
    bonusValue: 0.50, 
    color: '#0ea5e9' 
  },
  { 
    id: 'shadow', 
    name: '影子', 
    title: '忍者', 
    description: '神出鬼沒的捕魚高手。速度 +30%', 
    cost: 250000, 
    bonusType: 'SPEED_MULT', 
    bonusValue: 0.30, 
    color: '#171717' 
  },
];

export const FISH_TYPES: FishType[] = [
  // Special Items (Debris/Global) - NO SIZE
  { id: 'boot', name: '破舊長靴', rarity: 'Junk', basePrice: 10, color: '#57534e', activeTime: 'All', locations: ['pond', 'river', 'ocean', 'swamp', 'deep_sea'] },
  { id: 'plastic_bottle', name: '塑膠瓶', rarity: 'Junk', basePrice: 15, color: '#38bdf8', activeTime: 'All', locations: ['pond', 'river', 'ocean'] },
  { id: 'ghost_net', name: '幽靈漁網', rarity: 'Junk', basePrice: 50, color: '#155e75', activeTime: 'All', locations: ['ocean', 'river', 'deep_sea'] },
  { id: 'chest', name: '古代寶箱', rarity: 'Treasure', basePrice: 5000, color: '#fbbf24', activeTime: 'All', locations: ['pond', 'river', 'ocean', 'swamp', 'sky', 'deep_sea'], description: '裡面可能藏有寶石！' },

  // --- Pond (Starter) ---
  { id: 'minnow', name: '溪哥', rarity: 'Common', basePrice: 5, color: '#94a3b8', activeTime: 'Day', locations: ['pond'], minSize: 5, maxSize: 15 },
  { id: 'tiger_prawn', name: '草蝦', rarity: 'Common', basePrice: 8, color: '#a3e635', activeTime: 'All', locations: ['pond'], minSize: 8, maxSize: 18 },
  { id: 'goldfish', name: '金魚', rarity: 'Common', basePrice: 12, color: '#fb923c', activeTime: 'Day', locations: ['pond'], minSize: 5, maxSize: 20 },
  { id: 'carp', name: '鯉魚', rarity: 'Rare', basePrice: 35, color: '#f87171', activeTime: 'All', locations: ['pond'], minSize: 20, maxSize: 80 },
  { id: 'catfish', name: '大鯰魚', rarity: 'Epic', basePrice: 120, color: '#475569', activeTime: 'Night', locations: ['pond'], minSize: 60, maxSize: 150 },
  { id: 'koi', name: '黃金錦鯉', rarity: 'Legendary', basePrice: 500, color: '#fbbf24', activeTime: 'Day', locations: ['pond'], minSize: 40, maxSize: 100 },
  
  // --- River (Flowing Water) ---
  { id: 'perch', name: '河鱸', rarity: 'Common', basePrice: 25, color: '#64748b', activeTime: 'All', locations: ['river'], minSize: 15, maxSize: 40 },
  { id: 'crayfish', name: '小龍蝦', rarity: 'Common', basePrice: 30, color: '#ef4444', activeTime: 'All', locations: ['river'], minSize: 10, maxSize: 25 },
  { id: 'trout', name: '彩虹鱒', rarity: 'Rare', basePrice: 60, color: '#a78bfa', activeTime: 'Day', locations: ['river'], minSize: 25, maxSize: 60 },
  { id: 'mitten_crab', name: '大閘蟹', rarity: 'Rare', basePrice: 85, color: '#57534e', activeTime: 'Night', locations: ['river'], minSize: 10, maxSize: 25 },
  { id: 'salmon', name: '櫻花鉤吻鮭', rarity: 'Epic', basePrice: 200, color: '#fb7185', activeTime: 'All', locations: ['river'], minSize: 20, maxSize: 40 },
  { id: 'piranha', name: '食人魚', rarity: 'Epic', basePrice: 250, color: '#ef4444', activeTime: 'All', locations: ['river'], minSize: 10, maxSize: 30 },
  { id: 'arowana', name: '紅龍', rarity: 'Legendary', basePrice: 1500, color: '#b91c1c', activeTime: 'All', locations: ['river'], minSize: 50, maxSize: 120 },
  
  // --- Ocean (Deep Sea) ---
  { id: 'sardine', name: '沙丁魚', rarity: 'Common', basePrice: 40, color: '#cbd5e1', activeTime: 'Day', locations: ['ocean'], minSize: 10, maxSize: 25 },
  { id: 'crab', name: '海蟹', rarity: 'Common', basePrice: 55, color: '#f87171', activeTime: 'All', locations: ['ocean'], minSize: 10, maxSize: 30 },
  { id: 'lobster', name: '波士頓龍蝦', rarity: 'Rare', basePrice: 180, color: '#dc2626', activeTime: 'Night', locations: ['ocean'], minSize: 30, maxSize: 60 },
  { id: 'eel', name: '電鰻', rarity: 'Rare', basePrice: 200, color: '#facc15', activeTime: 'Night', locations: ['ocean'], weatherPreference: ['Storm'], minSize: 80, maxSize: 200 },
  { id: 'tuna', name: '黑鮪魚', rarity: 'Epic', basePrice: 450, color: '#1e3a8a', activeTime: 'All', locations: ['ocean'], minSize: 100, maxSize: 300 },
  { id: 'humphead', name: '龍王鯛', rarity: 'Epic', basePrice: 1200, color: '#06b6d4', activeTime: 'Day', locations: ['ocean'], minSize: 50, maxSize: 200 },
  { id: 'king_crab', name: '帝王蟹', rarity: 'Epic', basePrice: 600, color: '#991b1b', activeTime: 'Night', locations: ['ocean', 'deep_sea'], minSize: 80, maxSize: 150 },
  { id: 'shark', name: '大白鯊', rarity: 'Legendary', basePrice: 2500, color: '#94a3b8', activeTime: 'Day', locations: ['ocean'], minSize: 200, maxSize: 600 },
  { id: 'leviathan', name: '利維坦幼崽', rarity: 'Mythic', basePrice: 8000, color: '#8b5cf6', activeTime: 'Night', locations: ['ocean'], weatherPreference: ['Storm'], minSize: 500, maxSize: 1000 },

  // --- Deep Sea (The Abyss) ---
  { id: 'lantern_fish', name: '燈籠魚', rarity: 'Common', basePrice: 300, color: '#22d3ee', activeTime: 'All', locations: ['deep_sea'], minSize: 15, maxSize: 60 },
  { id: 'blobfish', name: '水滴魚', rarity: 'Rare', basePrice: 800, color: '#fda4af', activeTime: 'All', locations: ['deep_sea'], minSize: 20, maxSize: 40 },
  { id: 'viperfish', name: '毒牙魚', rarity: 'Epic', basePrice: 1500, color: '#a855f7', activeTime: 'Night', locations: ['deep_sea'], minSize: 30, maxSize: 60 },
  { id: 'oarfish', name: '皇帶魚', rarity: 'Legendary', basePrice: 5000, color: '#e2e8f0', activeTime: 'All', locations: ['deep_sea'], minSize: 300, maxSize: 1100 },
  { id: 'goblin_shark', name: '歐氏尖吻鯊', rarity: 'Legendary', basePrice: 4500, color: '#f43f5e', activeTime: 'Night', locations: ['deep_sea'], minSize: 200, maxSize: 400 },
  { id: 'giant_squid', name: '巨型烏賊', rarity: 'Mythic', basePrice: 12000, color: '#b91c1c', activeTime: 'All', locations: ['deep_sea'], minSize: 600, maxSize: 1400 },
  { id: 'coelacanth', name: '腔棘魚', rarity: 'Mythic', basePrice: 20000, color: '#1e3a8a', activeTime: 'All', locations: ['deep_sea'], minSize: 100, maxSize: 200 },

  // --- Swamp (Mystic) ---
  { id: 'mudskipper', name: '彈塗魚', rarity: 'Common', basePrice: 80, color: '#78350f', activeTime: 'Day', locations: ['swamp'], minSize: 8, maxSize: 20 },
  { id: 'neon_tetra', name: '霓虹燈魚', rarity: 'Common', basePrice: 100, color: '#22d3ee', activeTime: 'Night', locations: ['swamp'], minSize: 2, maxSize: 5 },
  { id: 'skeleton_fish', name: '骨駭魚', rarity: 'Epic', basePrice: 800, color: '#e5e5e5', activeTime: 'Night', locations: ['swamp'], minSize: 30, maxSize: 70 },
  { id: 'wisp_jelly', name: '鬼火水母', rarity: 'Legendary', basePrice: 4000, color: '#34d399', activeTime: 'Night', locations: ['swamp'], minSize: 20, maxSize: 50 },
  { id: 'hydra', name: '九頭蛇', rarity: 'Mythic', basePrice: 15000, color: '#10b981', activeTime: 'All', locations: ['swamp'], weatherPreference: ['Rain', 'Storm'], minSize: 300, maxSize: 800 },

  // --- Sky (Cosmic) ---
  { id: 'flying_fish', name: '飛魚', rarity: 'Common', basePrice: 200, color: '#38bdf8', activeTime: 'Day', locations: ['sky'], minSize: 20, maxSize: 45 },
  { id: 'moonfish', name: '月光魚', rarity: 'Rare', basePrice: 600, color: '#c7d2fe', activeTime: 'Night', locations: ['sky'], minSize: 10, maxSize: 30 },
  { id: 'cloud_ray', name: '雲端魟魚', rarity: 'Epic', basePrice: 1500, color: '#e0f2fe', activeTime: 'All', locations: ['sky'], minSize: 150, maxSize: 400 },
  { id: 'angel_fish', name: '天使魚', rarity: 'Epic', basePrice: 1800, color: '#facc15', activeTime: 'Day', locations: ['sky'], minSize: 15, maxSize: 30 },
  { id: 'solar_discus', name: '太陽神仙', rarity: 'Legendary', basePrice: 6000, color: '#f97316', activeTime: 'Day', locations: ['sky'], minSize: 40, maxSize: 90 },
  { id: 'void_eater', name: '虛空吞噬者', rarity: 'Mythic', basePrice: 25000, color: '#4c1d95', activeTime: 'All', locations: ['sky'], weatherPreference: ['Storm'], minSize: 200, maxSize: 500 },
  { id: 'star_whale', name: '星空鯨', rarity: 'Mythic', basePrice: 50000, color: '#4338ca', activeTime: 'Night', locations: ['sky'], minSize: 1000, maxSize: 5000 },
];

export const UPGRADES: UpgradeDef[] = [
  { id: 'rod_speed', name: '碳纖維竿', type: 'SPEED', description: '提升釣魚速度', baseCost: 50, costMult: 1.4, maxLevel: 30 },
  { id: 'bait_luck', name: '幸運護符', type: 'LUCK', description: '增加稀有魚機率', baseCost: 200, costMult: 1.6, maxLevel: 20 },
  { id: 'tank_size', name: '水族箱擴建', type: 'TANK_SIZE', description: '增加養殖上限', baseCost: 500, costMult: 1.8, maxLevel: 15 },
  { id: 'auto_cast', name: '自動拋竿機', type: 'AUTO_CAST', description: 'Lv1解鎖，升級減少等待時間', baseCost: 1000, costMult: 2.2, maxLevel: 10 },
  { id: 'auto_reel', name: '強力馬達', type: 'AUTO_REEL', description: 'Lv1解鎖，升級加快收線速度', baseCost: 2000, costMult: 2.2, maxLevel: 10 },
  { id: 'offline_storage', name: '時光保險箱', type: 'OFFLINE', description: '延長離線收益計算時間', baseCost: 3000, costMult: 2.0, maxLevel: 10 },
  { id: 'life_jacket', name: '專業救生衣', type: 'SAFETY', description: '友善釣魚必備。惡劣天氣下增加安全性與運氣', baseCost: 1500, costMult: 3.0, maxLevel: 5 },
];
