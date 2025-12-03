import { Request, Response } from 'express';
import RichtungRepository from '../repository/richtung';

export default class RichtungController {
  private repository: RichtungRepository;

  constructor(repository?: RichtungRepository) {
    this.repository = repository ?? new RichtungRepository();
  }

  public async list(_req: Request, res: Response): Promise<void> {
    const richtungValues = await this.repository.getDistinctValues();
    res.status(200).setHeader('Content-Type', 'application/json').send(richtungValues);
  }
}
