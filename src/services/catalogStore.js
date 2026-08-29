// Catalog Store — Persistent Memory for USD Shop Items, Inventory Levels & Price History

const STORAGE_KEY = 'scalar_catalog_usd_v2';
const HISTORY_KEY = 'scalar_history_usd_v2';

// US Shop / Coffee / Retail Seed Inventory
const DEFAULT_ITEMS = [
  {
    id: 'item_1',
    name: 'Artisan Croissant',
    canonicalName: 'croissant',
    aliases: ['croissant', 'croissants', 'artisan croissant', 'butter croissant'],
    currentPrice: 4.50,
    currency: 'USD',
    currentStock: 12,
    maxStock: 50,
    minStockThreshold: 15,
    totalSold: 38,
    expiryDate: '2026-09-02',
    supplier: 'BakeHouse Artisans',
    priceHistory: [{ price: 4.50, timestamp: Date.now() - 86400000 * 2, note: 'Initial price' }]
  },
  {
    id: 'item_2',
    name: 'Oat Milk Latte',
    canonicalName: 'oat milk latte',
    aliases: ['latte', 'oat milk latte', 'oat latte', 'iced latte', 'coffee'],
    currentPrice: 5.75,
    currency: 'USD',
    currentStock: 8,
    maxStock: 60,
    minStockThreshold: 10,
    totalSold: 52,
    expiryDate: '2026-09-05',
    supplier: 'Pacific Oat Co',
    priceHistory: [{ price: 5.75, timestamp: Date.now() - 86400000 * 5, note: 'Initial price' }]
  },
  {
    id: 'item_3',
    name: 'Organic Espresso Beans (12oz)',
    canonicalName: 'espresso beans',
    aliases: ['beans', 'espresso beans', 'coffee beans', 'bag of beans'],
    currentPrice: 18.00,
    currency: 'USD',
    currentStock: 4,
    maxStock: 30,
    minStockThreshold: 8, // Low stock warning!
    totalSold: 26,
    expiryDate: '2026-10-15',
    supplier: 'RoastMasters Direct',
    priceHistory: [{ price: 18.00, timestamp: Date.now() - 86400000 * 3, note: 'Initial price' }]
  },
  {
    id: 'item_4',
    name: 'Avocado Toast',
    canonicalName: 'avocado toast',
    aliases: ['toast', 'avocado toast', 'avo toast'],
    currentPrice: 9.50,
    currency: 'USD',
    currentStock: 25,
    maxStock: 40,
    minStockThreshold: 10,
    totalSold: 15,
    expiryDate: '2026-08-31',
    supplier: 'Fresh Produce LLC',
    priceHistory: [{ price: 9.50, timestamp: Date.now() - 86400000 * 1, note: 'Initial price' }]
  }
];

export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Just now';
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

export class CatalogStore {
  constructor() {
    this.items = this.loadCatalog();
    this.ledgerHistory = this.loadLedger();
  }

  loadCatalog() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const items = stored ? JSON.parse(stored) : DEFAULT_ITEMS;
      
      // Safety normalization to prevent blank page runtime errors on malformed objects
      return items.map((item, idx) => ({
        id: item.id || `item_safe_${idx}`,
        name: item.name || 'Unnamed Product',
        canonicalName: item.canonicalName || (item.name ? item.name.toLowerCase() : 'unnamed'),
        aliases: Array.isArray(item.aliases) ? item.aliases : [item.name ? item.name.toLowerCase() : 'unnamed'],
        currentPrice: typeof item.currentPrice === 'number' ? item.currentPrice : parseFloat(item.currentPrice) || 0,
        currency: item.currency || 'USD',
        currentStock: typeof item.currentStock === 'number' ? item.currentStock : parseInt(item.currentStock) || 20,
        maxStock: typeof item.maxStock === 'number' ? item.maxStock : parseInt(item.maxStock) || 50,
        minStockThreshold: typeof item.minStockThreshold === 'number' ? item.minStockThreshold : parseInt(item.minStockThreshold) || 10,
        totalSold: item.totalSold || 0,
        expiryDate: item.expiryDate || '2026-10-15',
        supplier: item.supplier || 'Direct Wholesaler',
        priceHistory: Array.isArray(item.priceHistory) && item.priceHistory.length > 0 ? item.priceHistory : [{ price: item.currentPrice || 0, timestamp: Date.now(), note: 'Initial price' }]
      }));
    } catch (e) {
      return DEFAULT_ITEMS;
    }
  }

  saveCatalog() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      }
    } catch (e) {
      console.error('Failed to save catalog:', e);
    }
  }

  loadLedger() {
    try {
      if (typeof localStorage === 'undefined') return [];
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveLedger() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(this.ledgerHistory));
      }
    } catch (e) {
      console.error('Failed to save ledger:', e);
    }
  }

  resetStore() {
    this.items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
    this.ledgerHistory = [];
    this.saveCatalog();
    this.saveLedger();
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('scalar_onboarding_completed', 'true');
    }
  }

  isOnboardingCompleted() {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('scalar_onboarding_completed') === 'true';
  }

  setOnboardingCompleted(completed = true) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('scalar_onboarding_completed', completed ? 'true' : 'false');
    }
  }

  populateMockData() {
    this.items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
    this.ledgerHistory = [
      {
        id: 'tx_seed_1',
        timestamp: Date.now() - 1000 * 60 * 15,
        name: 'Artisan Croissant',
        quantity: 2,
        unitPrice: 4.50,
        totalPrice: 9.00,
        currency: 'USD',
        mode: 'AGENT',
        status: 'CONFIRMED'
      },
      {
        id: 'tx_seed_2',
        timestamp: Date.now() - 1000 * 60 * 45,
        name: 'Oat Milk Latte',
        quantity: 3,
        unitPrice: 5.75,
        totalPrice: 17.25,
        currency: 'USD',
        mode: 'AGENT',
        status: 'CONFIRMED'
      }
    ];
    this.saveCatalog();
    this.saveLedger();
    this.setOnboardingCompleted(true);
  }

  clearAllData() {
    this.items = [];
    this.ledgerHistory = [];
    this.saveCatalog();
    this.saveLedger();
    this.setOnboardingCompleted(false);
  }

  // RAG Fuzzy Synonym Matcher
  findMatchingItem(query) {
    if (!query) return null;
    const cleanQuery = query.trim().toLowerCase();

    for (const item of this.items) {
      if (item.canonicalName === cleanQuery || item.name.toLowerCase() === cleanQuery) {
        return { item, matchScore: 1.0, matchType: 'EXACT' };
      }
      for (const alias of item.aliases) {
        if (alias === cleanQuery) {
          return { item, matchScore: 0.95, matchType: 'ALIAS_EXACT' };
        }
      }
    }

    let bestMatch = null;
    let highestScore = 0;

    for (const item of this.items) {
      for (const alias of item.aliases) {
        let score = 0;
        if (cleanQuery.includes(alias) || alias.includes(cleanQuery)) {
          const minLen = Math.min(cleanQuery.length, alias.length);
          const maxLen = Math.max(cleanQuery.length, alias.length);
          score = minLen / maxLen;
        }

        if (score > highestScore && score >= 0.5) {
          highestScore = score;
          bestMatch = { item, matchScore: score, matchType: 'FUZZY_SEMANTIC' };
        }
      }
    }

    return bestMatch;
  }

  // Add ledger entry & update stock levels
  addLedgerEntry(entry) {
    const record = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: Date.now(),
      ...entry
    };

    // Deduct stock for sold items
    const match = this.items.find(i => i.name.toLowerCase() === entry.name.toLowerCase());
    if (match) {
      match.currentStock = Math.max(0, match.currentStock - (entry.quantity || 1));
      match.totalSold = (match.totalSold || 0) + (entry.quantity || 1);
      this.saveCatalog();
    }

    this.ledgerHistory.unshift(record);
    this.saveLedger();
    return record;
  }

  updateItemCatalog(itemId, newPrice, newAlias = null, note = 'Updated via transaction') {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return null;

    if (newPrice !== undefined && newPrice !== item.currentPrice) {
      item.priceHistory.push({ price: newPrice, timestamp: Date.now(), note });
      item.currentPrice = newPrice;
    }

    if (newAlias && !item.aliases.includes(newAlias.toLowerCase())) {
      item.aliases.push(newAlias.toLowerCase());
    }

    this.saveCatalog();
    return item;
  }

  editItem(itemId, updates) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return null;

    if (updates.name && updates.name !== item.name) {
      item.name = updates.name.trim();
      item.canonicalName = item.name.toLowerCase();
      if (!item.aliases.includes(item.canonicalName)) {
        item.aliases.push(item.canonicalName);
      }
    }

    if (updates.currentPrice !== undefined && updates.currentPrice !== item.currentPrice) {
      const newP = parseFloat(updates.currentPrice) || item.currentPrice;
      item.priceHistory.push({ price: newP, timestamp: Date.now(), note: 'Manual price adjustment' });
      item.currentPrice = newP;
    }

    if (updates.currentStock !== undefined) {
      item.currentStock = Math.max(0, parseInt(updates.currentStock) || 0);
    }

    if (updates.maxStock !== undefined) {
      item.maxStock = Math.max(1, parseInt(updates.maxStock) || 50);
    }

    if (updates.minStockThreshold !== undefined) {
      item.minStockThreshold = Math.max(0, parseInt(updates.minStockThreshold) || 5);
    }

    if (updates.supplier !== undefined) {
      item.supplier = updates.supplier.trim();
    }

    if (updates.expiryDate !== undefined) {
      item.expiryDate = updates.expiryDate.trim();
    }

    this.saveCatalog();
    return item;
  }

  deleteItem(itemId) {
    this.items = this.items.filter(i => i.id !== itemId);
    this.saveCatalog();
  }

  createNewItem(name, price, currency = 'USD', stock = 20, maxStock = 50, supplier = 'Direct Wholesaler', expiryDate = '2026-10-15') {
    const canonical = name.trim().toLowerCase();
    const newItem = {
      id: 'item_' + Date.now(),
      name: name.trim(),
      canonicalName: canonical,
      aliases: [canonical],
      currentPrice: parseFloat(price) || 0,
      currency: currency,
      currentStock: parseInt(stock) || 20,
      maxStock: parseInt(maxStock) || 50,
      minStockThreshold: 10,
      totalSold: 0,
      expiryDate: expiryDate.trim() || '2026-10-15',
      supplier: supplier.trim() || 'Direct Wholesaler',
      priceHistory: [{ price: parseFloat(price) || 0, timestamp: Date.now(), note: 'Initial creation' }]
    };
    this.items.push(newItem);
    this.saveCatalog();
    return newItem;
  }
}

export const catalogStore = new CatalogStore();

