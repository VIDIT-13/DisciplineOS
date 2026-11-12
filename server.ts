import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'discipline_records.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read data safely
function readAllData(): Record<string, any> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading discipline records:', err);
  }
  return {};
}

// Helper to write data safely
function writeAllData(data: Record<string, any>) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving discipline records:', err);
  }
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET: Fetch records for a user
app.get('/api/discipline', (req, res) => {
  const user = ((req.query.user as string) || 'primary_user').trim().toLowerCase();
  const allData = readAllData();
  const userRecords = allData[user] || {};
  res.json({
    success: true,
    user,
    records: userRecords,
    lastSynced: new Date().toISOString(),
  });
});

// POST: Sync/Save records for a user
app.post('/api/discipline', (req, res) => {
  const user = ((req.body.user as string) || 'primary_user').trim().toLowerCase();
  const incomingRecords = req.body.records || {};

  const allData = readAllData();
  const currentRecords = allData[user] || {};

  // Smart 2-way merge: for each date, keep whichever has more completions or newer timestamp
  const merged = { ...currentRecords };

  for (const dateKey of Object.keys(incomingRecords)) {
    const incoming = incomingRecords[dateKey];
    const existing = merged[dateKey];

    if (!existing) {
      merged[dateKey] = incoming;
    } else {
      const incomingCount = incoming.count ?? (incoming.completedTaskIds?.length || 0);
      const existingCount = existing.count ?? (existing.completedTaskIds?.length || 0);

      if (incomingCount > existingCount) {
        merged[dateKey] = incoming;
      } else if (incomingCount === existingCount) {
        // Tie-breaker: keep incoming if it has a newer updatedAt or equal
        merged[dateKey] = incoming;
      }
    }
  }

  allData[user] = merged;
  writeAllData(allData);

  res.json({
    success: true,
    user,
    records: merged,
    lastSynced: new Date().toISOString(),
  });
});

// Start server with Vite or static assets
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    // Mount Vite in dev mode
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DisciplineOS server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
