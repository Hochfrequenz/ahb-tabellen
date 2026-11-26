import { Request, Response, NextFunction } from 'express';
import MigService from '../service/mig.service';

export default class MigController {
  private service: MigService;

  constructor(service?: MigService) {
    this.service = service ?? new MigService();
  }

  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formatVersion = (req.query['format-version'] as string | undefined) ?? '';
      res.status(200).json(await this.service.listMigs(formatVersion));
    } catch (error) {
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formatVersion = req.params['formatVersion'] as string;
      const format = req.params['format'] as string;
      const version = req.query['version'] as string | undefined;
      res.status(200).json(await this.service.getMigTree(formatVersion, format, version));
    } catch (error) {
      next(error);
    }
  }
}
