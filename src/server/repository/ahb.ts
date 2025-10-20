import { Ahb } from '../../app/core/api/models';
import { NotFoundError } from '../infrastructure/errors';
import { AppDataSource } from '../infrastructure/database';
import { AhbLine, Anwendungshandbuch } from '../entities/ahb-line.entity';
import { XlsxGeneratorService } from '../infrastructure/xlsx-generator.service';

export enum FileType {
  CSV = 'csv',
  JSON = 'json',
  XLSX = 'xlsx',
}

export default class AHBRepository {
  private xlsxGenerator: XlsxGeneratorService;

  constructor() {
    this.xlsxGenerator = new XlsxGeneratorService();
  }

  public async searchAhbLines(payload: {
    page: number;
    pageSize: number;
    sort: { field: string; direction?: 'asc' | 'desc' }[];
    q: string;
    filters?: Partial<
      Record<
        | 'format_version'
        | 'format'
        | 'pruefidentifikator'
        | 'description'
        | 'segmentgroup_key'
        | 'segment_code'
        | 'data_element'
        | 'qualifier'
        | 'line_ahb_status'
        | 'line_name'
        | 'bedingung',
        {
          eq?: string;
          neq?: string;
          contains?: string;
          startsWith?: string;
          endsWith?: string;
          in?: string[];
          isNull?: boolean;
          isNotNull?: boolean;
        }
      >
    >;
  }): Promise<{
    items: Array<{
      format_version: string;
      format: string;
      pruefidentifikator: string;
      description?: string | null;
      segmentgroup_key?: string | null;
      segment_code?: string | null;
      data_element?: string | null;
      qualifier?: string | null;
      line_ahb_status?: string | null;
      line_name?: string | null;
      bedingung?: string | null;
      direction?: string | null;
    }>;
    total: number;
    page: number;
    pageSize: number;
  }> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Define allowed fields with their corresponding entity property names
    const allowedFields = [
      'format_version',
      'format',
      'pruefidentifikator',
      'description',
      'segmentgroup_key',
      'segment_code',
      'data_element',
      'qualifier',
      'line_ahb_status',
      'line_name',
      'bedingung',
      'direction',
    ] as const;

    // TypeORM's built-in column reference method for security
    // This uses TypeORM's entity metadata to resolve column names safely
    const getColumnReference = (field: string): string => {
      // Validate field exists in allowed fields first
      if (!allowedFields.includes(field as any)) {
        throw new Error(`Invalid field: ${field}`);
      }

      // Get the entity metadata to access column information
      // This prevents SQL injection by using TypeORM's built-in column resolution
      const entityMetadata = AppDataSource.getRepository(AhbLine).metadata;
      const column = entityMetadata.findColumnWithPropertyName(field);

      if (!column) {
        throw new Error(`Column not found for field: ${field}`);
      }

      // Return the properly quoted column name with table alias
      // TypeORM handles the proper escaping and quoting of column names
      return `al.${column.databaseName}`;
    };

    const qb = AppDataSource.getRepository(AhbLine)
      .createQueryBuilder('al')
      .select([
        'al.format_version as format_version',
        'al.format as format',
        'al.pruefidentifikator as pruefidentifikator',
        'al.description as description',
        'al.segmentgroup_key as segmentgroup_key',
        'al.segment_code as segment_code',
        'al.data_element as data_element',
        'al.qualifier as qualifier',
        'al.line_ahb_status as line_ahb_status',
        'al.line_name as line_name',
        'al.bedingung as bedingung',
        'al.direction as direction',
        'al.sort_path as sort_path',
      ]);

    // Filters (AND) - Using TypeORM's secure column reference
    const filters = payload.filters ?? {};
    Object.entries(filters).forEach(([field, value]) => {
      if (!value) return;
      if (!(allowedFields as readonly string[]).includes(field)) return;

      const columnRef = getColumnReference(field);
      const paramBase = `f_${field}`;

      if (value.eq !== undefined) {
        qb.andWhere(`${columnRef} = :${paramBase}_eq`, { [`${paramBase}_eq`]: value.eq });
      }
      if (value.neq !== undefined) {
        qb.andWhere(`(${columnRef} IS NULL OR ${columnRef} != :${paramBase}_neq)`, {
          [`${paramBase}_neq`]: value.neq,
        });
      }
      if (value.contains !== undefined) {
        qb.andWhere(`LOWER(${columnRef}) LIKE :${paramBase}_contains`, {
          [`${paramBase}_contains`]: `%${value.contains.toLowerCase()}%`,
        });
      }
      if (value.startsWith !== undefined) {
        qb.andWhere(`LOWER(${columnRef}) LIKE :${paramBase}_starts`, {
          [`${paramBase}_starts`]: `${value.startsWith.toLowerCase()}%`,
        });
      }
      if (value.endsWith !== undefined) {
        qb.andWhere(`LOWER(${columnRef}) LIKE :${paramBase}_ends`, {
          [`${paramBase}_ends`]: `%${value.endsWith.toLowerCase()}`,
        });
      }
      if (value.in && value.in.length > 0) {
        qb.andWhere(`${columnRef} IN (:...${paramBase}_in)`, {
          [`${paramBase}_in`]: value.in,
        });
      }
      if (value.isNull) {
        qb.andWhere(`${columnRef} IS NULL`);
      }
      if (value.isNotNull) {
        qb.andWhere(`${columnRef} IS NOT NULL`);
      }
    });

    // Global q across the 11 fields (case-insensitive LIKE) - Using secure column reference
    const q = (payload.q || '').trim().toLowerCase();
    if (q.length > 0) {
      const qFields = [
        'format_version',
        'format',
        'pruefidentifikator',
        'description',
        'segmentgroup_key',
        'segment_code',
        'data_element',
        'qualifier',
        'line_ahb_status',
        'line_name',
        'bedingung',
      ];
      const orClauses = qFields.map((f, idx) => `LOWER(${getColumnReference(f)}) LIKE :q${idx}`);
      const params = Object.fromEntries(qFields.map((_, idx) => [`q${idx}`, `%${q}%`]));
      qb.andWhere(`(${orClauses.join(' OR ')})`, params);
    }

    // Sorting (allowlist) - Using secure column reference
    const sortRules = Array.isArray(payload.sort) ? payload.sort : [];
    if (sortRules.length === 0) {
      qb.addOrderBy('al.sort_path', 'ASC');
      qb.addOrderBy('al.pruefidentifikator', 'ASC');
    } else {
      sortRules.forEach((rule, idx) => {
        if (!rule || !(allowedFields as readonly string[]).includes(rule.field)) return;

        const columnRef = getColumnReference(rule.field);
        const dir = (rule.direction || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        if (idx === 0) qb.orderBy(columnRef, dir as 'ASC' | 'DESC');
        else qb.addOrderBy(columnRef, dir as 'ASC' | 'DESC');
      });
      // Always add stable sort fallback
      qb.addOrderBy('al.sort_path', 'ASC');
      qb.addOrderBy('al.pruefidentifikator', 'ASC');
    }

    // Pagination
    const pageSize = Math.min(Math.max(payload.pageSize || 25, 1), 200);
    const page = Math.max(payload.page || 1, 1);
    qb.skip((page - 1) * pageSize).take(pageSize);

    interface AhbRawRow {
      format_version: string;
      format: string;
      pruefidentifikator: string;
      description: string | null;
      segmentgroup_key: string | null;
      segment_code: string | null;
      data_element: string | null;
      qualifier: string | null;
      line_ahb_status: string | null;
      line_name: string | null;
      bedingung: string | null;
      direction: string | null;
    }

    const countQb = AppDataSource.getRepository(AhbLine).createQueryBuilder('al');
    // replicate where conditions for count (without pagination)
    countQb.setParameters(qb.getParameters());
    if (qb.expressionMap.wheres.length > 0) {
      countQb.where(qb.expressionMap.wheres.map(w => w.condition).join(' AND '));
    } else {
      countQb.where('1=1');
    }

    const rowsPromise = qb.getRawMany<AhbRawRow>();
    const countPromise = countQb.getCount();
    const [rows, total] = await Promise.all([rowsPromise, countPromise]);

    const items = (rows as AhbRawRow[]).map(r => ({
      format_version: r.format_version,
      format: r.format,
      pruefidentifikator: r.pruefidentifikator,
      description: r.description ?? null,
      segmentgroup_key: r.segmentgroup_key ?? null,
      segment_code: r.segment_code ?? null,
      data_element: r.data_element ?? null,
      qualifier: r.qualifier ?? null,
      line_ahb_status: r.line_ahb_status ?? null,
      line_name: r.line_name ?? null,
      bedingung: r.bedingung ?? null,
      direction: r.direction ?? null,
    }));

    return { items, total, page, pageSize };
  }
  // Retrieve a single AHB from either database (JSON) or generate XLSX on the fly
  public async get(pruefi: string, formatVersion: string, type: FileType): Promise<Ahb | Buffer> {
    if (type === FileType.JSON) {
      return this.getCompleteAhbFromDatabase(pruefi, formatVersion);
    } else if (type === FileType.XLSX) {
      const ahb = await this.getCompleteAhbFromDatabase(pruefi, formatVersion);
      return this.xlsxGenerator.generateXlsx(ahb);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  private mapMetaInformation(line: AhbLine, ahb: Anwendungshandbuch): Ahb['meta'] {
    return {
      description: line.description || '',
      direction: line.direction || '',
      pruefidentifikator: line.pruefidentifikator,
      versionsnummer: ahb.versionsnummer,
      veroeffentlichungsdatum: ahb.veroeffentlichungsdatum,
    };
  }

  private mapLine(line: AhbLine): Ahb['lines'][0] {
    const isSectionLine = line.line_type === 'segment' || line.line_type === 'segment_group';
    return {
      ahb_expression: line.line_ahb_status || '',
      conditions: line.bedingung || '',
      data_element: line.data_element?.startsWith('D_')
        ? line.data_element.substring(2)
        : line.data_element || '',
      guid: line.id,
      index: 0, // This will need to be calculated based on sort_path if needed
      name: isSectionLine ? '' : line.line_name || '',
      section_name: isSectionLine ? line.line_name || '' : '',
      segment_code: line.segment_code || '',
      segment_group_key: line.segmentgroup_key || '',
      value_pool_entry: line.qualifier || '',
      line_type: line.line_type || '',
    };
  }

  private async getAhbFromDatabase(pruefi: string, formatVersion: string): Promise<Ahb['lines']> {
    // Initialize the database connection if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Get the lines from the database view
    const lines = await AppDataSource.getRepository(AhbLine)
      .createQueryBuilder('al')
      .where('al.format_version = :formatVersion', { formatVersion })
      .andWhere('al.pruefidentifikator = :pruefi', { pruefi })
      .orderBy('al.sort_path', 'ASC')
      .getMany();

    if (lines.length === 0) {
      throw new NotFoundError(
        `AHB document not found. Prüfidentifikator: ${pruefi}, Format Version: ${formatVersion}`
      );
    }

    // Transform the data to match the API schema
    return lines.map(line => this.mapLine(line));
  }

  private async getMetaInformationFromDatabase(
    pruefi: string,
    formatVersion: string
  ): Promise<Ahb['meta']> {
    // Initialize the database connection if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Get a single line to extract meta information
    const firstLine = await AppDataSource.getRepository(AhbLine)
      .createQueryBuilder('al')
      .where('al.format_version = :formatVersion', { formatVersion })
      .andWhere('al.pruefidentifikator = :pruefi', { pruefi })
      .orderBy('al.sort_path', 'ASC')
      .getOne();

    if (!firstLine) {
      throw new NotFoundError(
        `AHB document not found. Prüfidentifikator: ${pruefi}, Format Version: ${formatVersion}`
      );
    }

    const ahb_document_metadata = await AppDataSource.getRepository(Anwendungshandbuch).findOne({
      where: { primary_key: firstLine.anwendungshandbuch_primary_key },
    });

    if (!ahb_document_metadata) {
      throw new NotFoundError(
        `AHB document not found. Prüfidentifikator: ${pruefi}, Format Version: ${formatVersion}`
      );
    }

    return this.mapMetaInformation(firstLine, ahb_document_metadata);
  }

  private async getCompleteAhbFromDatabase(pruefi: string, formatVersion: string): Promise<Ahb> {
    const [lines, meta] = await Promise.all([
      this.getAhbFromDatabase(pruefi, formatVersion),
      this.getMetaInformationFromDatabase(pruefi, formatVersion),
    ]);

    return {
      lines,
      meta,
    };
  }
}
