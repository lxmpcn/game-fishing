// 認證服務：使用 Web Crypto API 進行客戶端密碼雜湊，管理使用者註冊、登入與憑證儲存。

const CREDENTIALS_KEY = 'zenFisher_creds';

interface UserCredential {
  username: string; // The UID (Login ID)
  displayName: string; // The Visible Name
  passwordHash: string; // Hex string of SHA-256 hash
  salt: string; // Random salt per user
}

// Helper to convert buffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate a random salt
function generateSalt(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return bufferToHex(array.buffer);
}

// Hash password with salt
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

// Get all credentials (internal)
function getCredentials(): Record<string, UserCredential> {
  const stored = localStorage.getItem(CREDENTIALS_KEY);
  if (!stored) return {};
  return JSON.parse(stored);
}

// --- Public API ---

export const authService = {
  
  // Check if UID exists
  userExists: (username: string): boolean => {
    if (username === 'guest' || username === '11111') return true; // Special cases
    const creds = getCredentials();
    return !!creds[username];
  },

  // Check if Display Name is taken (Global check for immersion)
  isNameTaken: (name: string): boolean => {
      const creds = getCredentials();
      return Object.values(creds).some(user => user.displayName === name);
  },

  // Register a new user
  register: async (username: string, password: string, displayName: string): Promise<{ success: boolean; message?: string }> => {
    if (username === 'guest' || username === '11111') return { success: false, message: '此帳號為保留帳號' };
    
    const creds = getCredentials();
    if (creds[username]) {
      return { success: false, message: 'UID (帳號) 已存在' };
    }

    // Check display name uniqueness
    const nameTaken = Object.values(creds).some(u => u.displayName === displayName);
    if (nameTaken) {
        return { success: false, message: '此暱稱已被使用' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    creds[username] = { username, displayName, passwordHash, salt };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));

    return { success: true };
  },

  // Login verification - Returns display name on success
  login: async (username: string, password: string): Promise<{ success: boolean; displayName?: string }> => {
    // Dev backdoor
    if (username === '11111' && password === '11111') return { success: true, displayName: '開發者' };
    if (username === 'guest') return { success: true, displayName: 'Guest' };

    const creds = getCredentials();
    const user = creds[username];

    if (!user) return { success: false };

    const attemptHash = await hashPassword(password, user.salt);
    if (attemptHash === user.passwordHash) {
        return { success: true, displayName: user.displayName };
    }
    return { success: false };
  },

  // Helper to get display name by username
  getDisplayName: (username: string): string => {
      if (username === 'guest') return '冒險者';
      if (username === '11111') return '開發者';
      const creds = getCredentials();
      return creds[username]?.displayName || username;
  }
};