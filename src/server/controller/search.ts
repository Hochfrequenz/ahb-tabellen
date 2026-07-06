import { Request, Response, NextFunction } from 'express';
import AhbService from '../service/ahb.service';

export default class SearchController {
  private service: AhbService;

  constructor(service?: AhbService) {
    this.service = service ?? new AhbService();
  }

  public async query(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.service.searchAhbLines(req.body || {});
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
