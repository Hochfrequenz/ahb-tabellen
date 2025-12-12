import { AppDataSource } from '../infrastructure/database';

export interface DatenstandResult {
  veroeffentlichungsdatum: string;
}

export default class DatenstandRepository {
  public async getLatestVeroeffentlichungsdatum(): Promise<DatenstandResult> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Format directly in SQL using SQLite's strftime to get DD.MM.YYYY format
    const result = await AppDataSource.query<{ veroeffentlichungsdatum: string | null }[]>(
      `SELECT strftime('%d.%m.%Y', MAX(veroeffentlichungsdatum)) as veroeffentlichungsdatum
       FROM anwendungshandbuch`
    );

    const dateStr = result?.[0]?.veroeffentlichungsdatum;

    return { veroeffentlichungsdatum: dateStr || 'Unbekannt' };
  }
}
