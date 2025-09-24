import { AppDataSource } from '../infrastructure/database';
import { AhbLine } from '../entities/ahb-line.entity';

// The FormateRepository class is responsible for retrieving the unique formats from the database.
export default class FormateRepository {
  constructor() {}

  // Return a list of all unique formats from the database
  public async list(): Promise<string[]> {
    // Initialize the database connection if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const formats = await AppDataSource.getRepository(AhbLine)
      .createQueryBuilder('ahb')
      .select('DISTINCT ahb.format', 'format')
      .orderBy('ahb.format')
      .getRawMany();

    return formats.map(result => result.format);
  }
}
