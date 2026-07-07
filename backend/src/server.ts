import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runAgentLoop } from './agent';
import { seedData } from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'cardiq-backend' });
});

app.post('/agent/ask', async (req: Request, res: Response) => {
  try {
    const { message, userId, location } = req.body as {
      message: string;
      userId: string;
      location?: { lat: number; lng: number };
    };

    if (!message || !userId) {
      res.status(400).json({ error: 'message and userId are required' });
      return;
    }

    const response = await runAgentLoop({ message, userId, location });
    res.json({ response });
  } catch (err) {
    console.error('Agent error:', err);
    res.status(500).json({
      error: 'Agent failed',
      details: err instanceof Error ? err.message : 'Unknown',
    });
  }
});

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, async () => {
  console.log(`CardIQ backend running on port ${PORT}`);
  await seedData();
});
