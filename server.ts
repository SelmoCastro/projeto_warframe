import express from 'express';
import { createServer as createViteServer } from 'vite';

// Mock data to simulate the SQLite database for the frontend preview
const mockItems = [
  {
    id: 1,
    item_name: 'Chroma Prime Set',
    url_name: 'chroma_prime_set',
    thumb_url: 'https://warframe.market/static/assets/items/images/en/chroma_prime_set.png',
    tags: 'prime,set',
    drops: [
      { location: 'Lith C3', mission_type: 'Relic Intact', chance: 10.0 },
      { location: 'Meso C4', mission_type: 'Relic Radiant', chance: 33.3 }
    ],
    crafting: [
      { resource_name: 'Chroma Prime Blueprint', quantity: 1 },
      { resource_name: 'Chroma Prime Neuroptics', quantity: 1 },
      { resource_name: 'Chroma Prime Chassis', quantity: 1 },
      { resource_name: 'Chroma Prime Systems', quantity: 1 }
    ]
  },
  {
    id: 2,
    item_name: 'Argon Crystal',
    url_name: 'argon_crystal',
    thumb_url: 'https://warframe.market/static/assets/items/images/en/argon_crystal.png',
    tags: 'resource',
    drops: [
      { location: 'Void - Mot', mission_type: 'Survival', chance: 2.5 },
      { location: 'Void - Ani', mission_type: 'Survival', chance: 1.5 }
    ],
    crafting: [
      { resource_name: 'None', quantity: 0 }
    ]
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API: System Stats (Mocked for Dashboard)
  app.get('/api/stats', (req, res) => {
    res.json({
      totalItems: 14520,
      cachedPrices: 342,
      ramUsage: 145, // MB
      uptimeHours: 124,
      status: 'Online'
    });
  });

  // API: Endpoint de Busca (Idêntico ao FastAPI)
  app.get('/api/search', (req, res) => {
    console.log(`[API] Received search request for: ${req.query.query}`);
    try {
      const query = req.query.query as string;
      if (!query || query.length < 3) {
        console.log('[API] Query too short');
        return res.status(400).json({ detail: "Query must be at least 3 characters long." });
      }

      console.log('[API] Querying mock database...');
      const queryLower = query.toLowerCase();
      const item = mockItems.find(i => i.item_name.toLowerCase().includes(queryLower));
      
      if (!item) {
        console.log('[API] Item not found');
        return res.status(404).json({ detail: "Item não encontrado no banco de dados local." });
      }

      console.log(`[API] Item found: ${item.item_name}`);

      // Simula a chamada à API do Warframe Market para itens Prime/Set
      let market_price = null;
      const nameLower = item.item_name.toLowerCase();
      if (nameLower.includes('prime') || nameLower.includes('set') || nameLower.includes('mod')) {
        // Preço simulado para o preview
        market_price = nameLower.includes('chroma') ? 45.5 : 25.0; 
      }

      console.log('[API] Sending response');
      res.json({
        item_name: item.item_name,
        thumb_url: item.thumb_url,
        drop_locations: item.drops,
        crafting_resources: item.crafting,
        market_price: market_price
      });
    } catch (error) {
      console.error('[API] Error:', error);
      res.status(500).json({ detail: 'Internal Server Error' });
    }
  });

  // Configuração do Vite Middleware para servir o React
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Warframe Info Hub running on http://localhost:${PORT}`);
  });
}

startServer();
