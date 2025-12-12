
// A simple client-side auth service using Web Crypto API for hashing
// This prevents passwords from being stored in plain text in localStorage.

const CREDENTIALS_KEY = 'zenFisher_creds';

interface UserCredential {
  username: string;
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
  
  // Check if user exists
  userExists: (username: string): boolean => {
    if (username === 'guest' || username === '11111') return true; // Special cases
    const creds = getCredentials();
    return !!creds[username];
  },

  // Register a new user
  register: async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    if (username === 'guest' || username === '11111') return { success: false, message: '此帳號為保留帳號' };
    
    const creds = getCredentials();
    if (creds[username]) {
      return { success: false, message: '帳號已存在' };
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    creds[username] = { username, passwordHash, salt };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));

    return { success: true };
  },

  // Login verification
  login: async (username: string, password: string): Promise<boolean> => {
    // Dev backdoor
    if (username === '11111' && password === '11111') return true;
    if (username === 'guest') return true;

    const creds = getCredentials();
    const user = creds[username];

    if (!user) return false;

    const attemptHash = await hashPassword(password, user.salt);
    return attemptHash === user.passwordHash;
  }
};
