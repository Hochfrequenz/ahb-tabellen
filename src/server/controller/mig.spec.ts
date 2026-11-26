import { Request, Response, NextFunction } from 'express';
import MigController from './mig';
import MigService from '../service/mig.service';
import { ValidationError } from '../infrastructure/errors';

describe('MigController', () => {
  let service: jest.Mocked<MigService>;
  let controller: MigController;
  let res: { status: jest.Mock; json: jest.Mock };
  let next: jest.Mock;

  beforeEach(() => {
    service = { listMigs: jest.fn(), getMigTree: jest.fn() } as unknown as jest.Mocked<MigService>;
    controller = new MigController(service);
    res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    next = jest.fn();
  });

  it('lists the MIGs of a format version', async () => {
    service.listMigs.mockResolvedValue([]);
    await controller.list(
      { query: { 'format-version': 'FV2610' } } as unknown as Request,
      res as unknown as Response,
      next as NextFunction
    );
    expect(service.listMigs).toHaveBeenCalledWith('FV2610');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('passes format version, format and version to the service', async () => {
    const tree = { meta: {}, nodes: [] } as never;
    service.getMigTree.mockResolvedValue(tree);
    await controller.get(
      {
        params: { formatVersion: 'FV2610', format: 'UTILMD' },
        query: { version: 'S2.2' },
      } as unknown as Request,
      res as unknown as Response,
      next as NextFunction
    );
    expect(service.getMigTree).toHaveBeenCalledWith('FV2610', 'UTILMD', 'S2.2');
    expect(res.json).toHaveBeenCalledWith(tree);
  });

  it('forwards errors to the error handler', async () => {
    const error = new ValidationError('bad');
    service.getMigTree.mockRejectedValue(error);
    await controller.get(
      { params: { formatVersion: 'FV2610', format: 'X' }, query: {} } as unknown as Request,
      res as unknown as Response,
      next as NextFunction
    );
    expect(next).toHaveBeenCalledWith(error);
  });
});
