import { Request, Response } from 'express';
import MetadataService from '../service/metadata.service';

export default class RichtungController {
  private service: MetadataService;

  constructor(service?: MetadataService) {
    this.service = service ?? new MetadataService();
  }

  public async list(_req: Request, res: Response): Promise<void> {
    const richtungValues = await this.service.listDirections();
    res.status(200).setHeader('Content-Type', 'application/json').send(richtungValues);
  }
}
