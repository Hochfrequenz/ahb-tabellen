import { Request, Response } from 'express';
import MetadataService from '../service/metadata.service';

export default class FormatVersionController {
  private service: MetadataService;
  constructor(service?: MetadataService) {
    this.service = service ?? new MetadataService();
  }

  public async list(_req: Request, res: Response): Promise<void> {
    const formatVersionEntity = await this.service.listFormatVersions();
    res.status(200).setHeader('Content-Type', 'application/json').send(formatVersionEntity);
  }

  public async listPruefisByFormatVersion(req: Request, res: Response): Promise<void> {
    const formatVersion = req.params['formatVersion'];
    const pruefis = await this.service.listPruefisByFormatVersion(formatVersion);
    res.status(200).setHeader('Content-Type', 'application/json').send(pruefis);
  }
}
