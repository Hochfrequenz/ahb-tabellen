import { Request, Response } from 'express';
import DatenstandRepository from '../repository/datenstand';

export default class DatenstandController {
  private repository: DatenstandRepository;

  constructor(repository?: DatenstandRepository) {
    this.repository = repository ?? new DatenstandRepository();
  }

  public async get(_req: Request, res: Response): Promise<void> {
    const result = await this.repository.getLatestVeroeffentlichungsdatum();
    res.status(200).setHeader('Content-Type', 'application/json').json(result);
  }
}
