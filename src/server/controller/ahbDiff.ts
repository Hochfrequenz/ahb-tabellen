import { Request, Response, NextFunction } from 'express';
import AhbDiffService from '../service/ahbDiff.service';

export default class AhbDiffController {
  private service: AhbDiffService;

  constructor(service?: AhbDiffService) {
    this.service = service ?? new AhbDiffService();
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pruefi = req.params['pruefi'] as string;
      const formatVersionNew = req.query['format-version-new'] as string;
      const formatVersionOld = req.query['format-version-old'] as string;

      const result = await this.service.getDiff(pruefi, formatVersionNew, formatVersionOld);

      res.status(200).setHeader('Content-Type', 'application/json').json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formatVersionNew = req.query['format-version-new'] as string;
      const formatVersionOld = req.query['format-version-old'] as string;

      const result = await this.service.getSummary(formatVersionNew, formatVersionOld);

      res.status(200).setHeader('Content-Type', 'application/json').json(result);
    } catch (error) {
      next(error);
    }
  }
}
