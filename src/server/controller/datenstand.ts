import { Request, Response } from 'express';
import MetadataService from '../service/metadata.service';

export default class DatenstandController {
  private service: MetadataService;

  constructor(service?: MetadataService) {
    this.service = service ?? new MetadataService();
  }

  public async get(_req: Request, res: Response): Promise<void> {
    const result = await this.service.getDatenstand();
    res.status(200).setHeader('Content-Type', 'application/json').json(result);
  }
}
