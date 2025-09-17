import { Request, Response, NextFunction } from 'express';
import AHBRepository from '../repository/ahb';
import { ValidationError } from '../infrastructure/errors';

export default class SearchController {
  private repository: AHBRepository;

  constructor(repository?: AHBRepository) {
    this.repository = repository ?? new AHBRepository();
  }

  public async query(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, pageSize, sort, q, filters } = req.body || {};

      // Basic validation aligned with OpenAPI (required fields present)
      if (typeof page !== 'number' || page < 1) {
        throw new ValidationError('page must be a positive integer');
      }
      if (typeof pageSize !== 'number' || pageSize < 1) {
        throw new ValidationError('pageSize must be a positive integer');
      }
      if (!Array.isArray(sort)) {
        throw new ValidationError('sort must be an array');
      }
      if (typeof q !== 'string') {
        throw new ValidationError('q must be a string');
      }

      const result = await this.repository.searchAhbLines({
        page,
        pageSize,
        sort: sort.map((s: any) => ({ field: s.field, direction: s.direction })),
        q,
        filters,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
