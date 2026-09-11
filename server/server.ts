import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './scripts/seed.js';

dotenv.config();

export async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Initialize DB and Seed Data
  await connectDB();
  await seedDatabase();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Base API routes
  app.use('/api', apiRouter);

  // Global error handling middleware
  app.use(errorHandler);

  // Serve Vite dev server middleware or static production dist
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`ND2 Virtual Classroom Server running on http://0.0.0.0:${PORT}`);
  });

  return app;
}

startServer().catch((err) => {
  console.error('[Fatal] Server startup error:', err);
});
