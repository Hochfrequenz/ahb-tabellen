import { Request, Response, NextFunction } from 'express';
import MigService from '../service/mig.service';
import { ValidationError } from '../infrastructure/errors';

export default class MigController {
  private service: MigService;

  constructor(service?: MigService) {
    this.service = service ?? new MigService();
  }

  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const raw = req.query['format-version'] ?? '';
      if (typeof raw !== 'string') {
        throw new ValidationError('Give "format-version" once, e.g. ?format-version=FV2610.');
      }
      const formatVersion = raw;
      res.status(200).json(await this.service.listMigs(formatVersion));
    } catch (error) {
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formatVersion = req.params['formatVersion'] as string;
      const format = req.params['format'] as string;
      const version = req.query['version'];
      if (version !== undefined && typeof version !== 'string') {
        throw new ValidationError('Give "version" once, e.g. ?version=S2.2.');
      }
      res.status(200).json(await this.service.getMigTree(formatVersion, format, version));
    } catch (error) {
      next(error);
    }
  }

  public async ahbLinks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formatVersion = req.params['formatVersion'] as string;
      const pruefi = req.params['pruefi'] as string;
      res.status(200).json(await this.service.getAhbMigLinks(formatVersion, pruefi));
    } catch (error) {
      next(error);
    }
  }
}
