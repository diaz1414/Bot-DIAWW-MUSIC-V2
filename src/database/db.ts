import fs from "node:fs";
import path from "node:path";

export interface DatabaseDriver {
  exec(sql: string): void;
  run(sql: string, ...params: any[]): void;
  get<T = any>(sql: string, ...params: any[]): T | undefined;
  all<T = any>(sql: string, ...params: any[]): T[];
  close(): void;
}

let dbInstance: DatabaseDriver | null = null;

/**
 * Inisialisasi driver SQLite adaptif:
 * - Mendeteksi runtime Bun -> menggunakan 'bun:sqlite'
 * - Mendeteksi runtime Node.js v22+ -> menggunakan 'node:sqlite' (DatabaseSync)
 */
export function getDatabase(): DatabaseDriver {
  if (dbInstance) return dbInstance;

  const dataDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "diaww.sqlite");
  const isBun = typeof (process.versions as any).bun !== "undefined" || typeof (globalThis as any).Bun !== "undefined";

  if (isBun) {
    try {
      // Runtime Bun
      const { Database } = require("bun:sqlite");
      const rawDb = new Database(dbPath);
      rawDb.exec("PRAGMA journal_mode = WAL;");
      rawDb.exec("PRAGMA synchronous = NORMAL;");

      dbInstance = {
        exec(sql: string): void {
          rawDb.exec(sql);
        },
        run(sql: string, ...params: any[]): void {
          const stmt = rawDb.prepare(sql);
          stmt.run(...params);
        },
        get<T = any>(sql: string, ...params: any[]): T | undefined {
          const stmt = rawDb.prepare(sql);
          return stmt.get(...params) as T | undefined;
        },
        all<T = any>(sql: string, ...params: any[]): T[] {
          const stmt = rawDb.prepare(sql);
          return stmt.all(...params) as T[];
        },
        close(): void {
          rawDb.close();
        }
      };

      console.log(`[DATABASE] SQLite terhubung menggunakan runtime BUN (WAL Mode) di ${dbPath}`);
      return dbInstance;
    } catch (err) {
      console.warn("[DATABASE] Gagal menginisialisasi bun:sqlite, mencoba fallback ke node:sqlite:", err);
    }
  }

  // Runtime Node.js (v22+)
  try {
    const { DatabaseSync } = require("node:sqlite");
    const rawDb = new DatabaseSync(dbPath);
    rawDb.exec("PRAGMA journal_mode = WAL;");
    rawDb.exec("PRAGMA synchronous = NORMAL;");

    dbInstance = {
      exec(sql: string): void {
        rawDb.exec(sql);
      },
      run(sql: string, ...params: any[]): void {
        const stmt = rawDb.prepare(sql);
        stmt.run(...params);
      },
      get<T = any>(sql: string, ...params: any[]): T | undefined {
        const stmt = rawDb.prepare(sql);
        return stmt.get(...params) as T | undefined;
      },
      all<T = any>(sql: string, ...params: any[]): T[] {
        const stmt = rawDb.prepare(sql);
        return stmt.all(...params) as T[];
      },
      close(): void {
        rawDb.close();
      }
    };

    console.log(`[DATABASE] SQLite terhubung menggunakan runtime NODE.JS v22+ (WAL Mode) di ${dbPath}`);
    return dbInstance;
  } catch (err: any) {
    console.error("[DATABASE FATAL] Gagal menghubungkan ke driver SQLite:", err.message);
    throw new Error(`Tidak dapat memuat modul SQLite: ${err.message}. Pastikan menggunakan Bun atau Node.js v22+`);
  }
}
