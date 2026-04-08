import path from 'path';
import fs from 'fs';
import type { Database } from 'sqlite';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    // Se importa de manera dinámica (en tiempo de ejecución) 
    // para evitar que el proceso de "build" de Vercel falle al intentar cargar
    // binarios nativos no compatibles con su sistema de Linux antiguo.
    const sqlite3 = require('sqlite3');
    const { open } = require('sqlite');

    // Inicializar la base de datos en la carpeta data
    const dataDir = path.join(process.cwd(), 'data');
    
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    } catch (e) {
      console.warn("No se pudo crear la carpeta local (es probable que estés en producción/Vercel de solo lectura):", e);
    }

    dbInstance = await open({
      filename: path.join(dataDir, 'portfolio.db'),
      driver: sqlite3.Database
    });

    // Crear las tablas si no existen
    await dbInstance!.exec(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        concept TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return dbInstance!;
}
