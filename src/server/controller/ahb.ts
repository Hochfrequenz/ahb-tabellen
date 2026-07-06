import { FileType } from '../repository/ahb';
import { Request, Response, NextFunction } from 'express';
import AhbService from '../service/ahb.service';

const CONTENT_TYPE: Record<FileType, string> = {
  [FileType.XLSX]: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  [FileType.CSV]: 'text/csv',
  [FileType.JSON]: 'application/json',
};

export default class AHBController {
  private service: AhbService;
  constructor(service?: AhbService) {
    this.service = service ?? new AhbService();
  }

  public async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pruefi = req.params['pruefi'];
      const formatVersion = req.params['formatVersion'];
      const format = (req.query['format'] as string) || 'json';

      const { fileType, content } = await this.service.getAhb(pruefi, formatVersion, format);

      res
        .status(200)
        .setHeader('Content-Type', CONTENT_TYPE[fileType])
        .setHeader(
          'Content-Disposition',
          `attachment; filename=AHB_${formatVersion}_${pruefi}.${format}`
        );

      if (fileType === FileType.JSON) {
        res.json(content);
      } else {
        res.send(content);
      }
    } catch (error) {
      next(error);
    }
  }
}
