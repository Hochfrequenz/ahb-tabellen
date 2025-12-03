import { AppDataSource } from '../infrastructure/database';

export interface RichtungValues {
  sender: string[];
  empfaenger: string[];
}

export default class RichtungRepository {
  private cachedValues: RichtungValues | null = null;

  public async getDistinctValues(): Promise<RichtungValues> {
    if (this.cachedValues) {
      return this.cachedValues;
    }

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const senderQuery = `
      SELECT DISTINCT json_extract(je.value, '$.sender') as value
      FROM v_ahbtabellen, json_each(v_ahbtabellen.direction) as je
      WHERE direction IS NOT NULL
      ORDER BY value
    `;

    const empfaengerQuery = `
      SELECT DISTINCT json_extract(je.value, '$.empfaenger') as value
      FROM v_ahbtabellen, json_each(v_ahbtabellen.direction) as je
      WHERE direction IS NOT NULL
      ORDER BY value
    `;

    const [senderResults, empfaengerResults] = await Promise.all([
      AppDataSource.query(senderQuery),
      AppDataSource.query(empfaengerQuery),
    ]);

    this.cachedValues = {
      sender: senderResults.map((r: { value: string }) => r.value).filter(Boolean),
      empfaenger: empfaengerResults.map((r: { value: string }) => r.value).filter(Boolean),
    };

    return this.cachedValues;
  }

  public async isValidSender(value: string): Promise<boolean> {
    const values = await this.getDistinctValues();
    return values.sender.includes(value);
  }

  public async isValidEmpfaenger(value: string): Promise<boolean> {
    const values = await this.getDistinctValues();
    return values.empfaenger.includes(value);
  }

  public clearCache(): void {
    this.cachedValues = null;
  }
}
