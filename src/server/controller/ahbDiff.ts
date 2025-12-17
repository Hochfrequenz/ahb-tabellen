import AhbDiffRepository, { AhbDiffSummary } from '../repository/ahbDiff';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../infrastructure/errors';

export default class AhbDiffController {
  private repository: AhbDiffRepository;

  constructor(repository?: AhbDiffRepository) {
    this.repository = repository ?? new AhbDiffRepository();
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pruefi = req.params['pruefi'];
      const formatVersionNew = req.query['format-version-new'] as string;
      const formatVersionOld = req.query['format-version-old'] as string;

      if (!/^\d{5}$/.test(pruefi)) {
        throw new ValidationError(
          `Invalid Prüfidentifikator format: ${pruefi}. Expected 5 digits.`
        );
      }

      if (!formatVersionNew || !/^FV\d{4}$/.test(formatVersionNew)) {
        throw new ValidationError(
          `Invalid format-version-new: ${formatVersionNew}. Expected pattern: FV followed by 4 digits.`
        );
      }

      if (!formatVersionOld || !/^FV\d{4}$/.test(formatVersionOld)) {
        throw new ValidationError(
          `Invalid format-version-old: ${formatVersionOld}. Expected pattern: FV followed by 4 digits.`
        );
      }

      const result = await this.repository.getDiff(pruefi, formatVersionNew, formatVersionOld);

      res.status(200).setHeader('Content-Type', 'application/json').json(result);
    } catch (error) {
      next(error);
    }
  }

  public async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const formatVersionNew = req.query['format-version-new'] as string;
      const formatVersionOld = req.query['format-version-old'] as string;

      if (!formatVersionNew || !/^FV\d{4}$/.test(formatVersionNew)) {
        throw new ValidationError(
          `Invalid format-version-new: ${formatVersionNew}. Expected pattern: FV followed by 4 digits.`
        );
      }

      if (!formatVersionOld || !/^FV\d{4}$/.test(formatVersionOld)) {
        throw new ValidationError(
          `Invalid format-version-old: ${formatVersionOld}. Expected pattern: FV followed by 4 digits.`
        );
      }

      const result: AhbDiffSummary = await this.repository.getSummary(
        formatVersionNew,
        formatVersionOld
      );

      res.status(200).setHeader('Content-Type', 'application/json').json(result);
    } catch (error) {
      next(error);
    }
  }
}
