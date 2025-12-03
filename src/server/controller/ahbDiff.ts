import AhbDiffRepository from '../repository/ahbDiff';
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
      const formatVersionA = req.query['format-version-a'] as string;
      const formatVersionB = req.query['format-version-b'] as string;

      if (!/^\d{5}$/.test(pruefi)) {
        throw new ValidationError(
          `Invalid Prüfidentifikator format: ${pruefi}. Expected 5 digits.`
        );
      }

      if (!formatVersionA || !/^FV\d{4}$/.test(formatVersionA)) {
        throw new ValidationError(
          `Invalid format-version-a: ${formatVersionA}. Expected pattern: FV followed by 4 digits.`
        );
      }

      if (!formatVersionB || !/^FV\d{4}$/.test(formatVersionB)) {
        throw new ValidationError(
          `Invalid format-version-b: ${formatVersionB}. Expected pattern: FV followed by 4 digits.`
        );
      }

      const result = await this.repository.getDiff(pruefi, formatVersionA, formatVersionB);

      res.status(200).setHeader('Content-Type', 'application/json').json(result);
    } catch (error) {
      next(error);
    }
  }
}
