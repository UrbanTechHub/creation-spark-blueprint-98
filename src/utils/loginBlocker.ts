
interface LoginAttempt {
  username: string;
  lastLoginTime: number;
}

const BLOCK_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
const STORAGE_KEY = 'chase_login_blocks';

export const loginBlocker = {
  // Check if a username is currently blocked
  isBlocked: (username: string): boolean => {
    const blocks = loginBlocker.getBlocks();
    const userBlock = blocks.find(block => block.username.toLowerCase() === username.toLowerCase());
    
    if (!userBlock) {
      console.log(`No block found for user: ${username}`);
      return false;
    }
    
    const now = Date.now();
    const timeElapsed = now - userBlock.lastLoginTime;
    const isCurrentlyBlocked = timeElapsed < BLOCK_DURATION;
    
    console.log(`User ${username} - Time elapsed: ${Math.floor(timeElapsed / 1000 / 60)} minutes, Blocked: ${isCurrentlyBlocked}`);
    
    return isCurrentlyBlocked;
  },

  // Block a username after successful login
  blockUser: (username: string): void => {
    const blocks = loginBlocker.getBlocks();
    const existingBlockIndex = blocks.findIndex(block => block.username.toLowerCase() === username.toLowerCase());
    
    const newBlock: LoginAttempt = {
      username: username.toLowerCase(),
      lastLoginTime: Date.now()
    };

    if (existingBlockIndex >= 0) {
      blocks[existingBlockIndex] = newBlock;
    } else {
      blocks.push(newBlock);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    console.log(`User ${username} blocked until:`, new Date(Date.now() + BLOCK_DURATION));
  },

  // Get all blocks from localStorage
  getBlocks: (): LoginAttempt[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const blocks = stored ? JSON.parse(stored) : [];
      console.log('Current blocks:', blocks);
      return blocks;
    } catch {
      return [];
    }
  },

  // Clean up expired blocks
  cleanupExpiredBlocks: (): void => {
    const blocks = loginBlocker.getBlocks();
    const now = Date.now();
    const activeBlocks = blocks.filter(block => 
      (now - block.lastLoginTime) < BLOCK_DURATION
    );
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activeBlocks));
    console.log(`Cleaned up expired blocks. Active blocks remaining: ${activeBlocks.length}`);
  }
};
