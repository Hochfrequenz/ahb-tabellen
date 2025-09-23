import { Request, Response } from 'express';
import FormateRepository from '../repository/formate';

export default class FormateController {
  private repository: FormateRepository;
  
  constructor(repository?: FormateRepository) {
    this.repository = repository ?? new FormateRepository();
  }

  public async list(_req: Request, res: Response): Promise<void> {
    const formats = await this.repository.list();
    res.status(200).setHeader('Content-Type', 'application/json').send(formats);
  }
}
