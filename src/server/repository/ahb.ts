import { Ahb } from '../../app/core/api/models';
import { NotFoundError } from '../infrastructure/errors';
import { AppDataSource } from '../infrastructure/database';
import { AhbLine, Anwendungshandbuch, Kommunikationsrichtung } from '../entities/ahb-line.entity';
import { XlsxGeneratorService } from '../infrastructure/xlsx-generator.service';
import { SelectQueryBuilder } from 'typeorm';
import RichtungRepository from './richtung';

export enum FileType {
  CSV = 'csv',
  JSON = 'json',
  XLSX = 'xlsx',
}

export default class AHBRepository {
  private xlsxGenerator: XlsxGeneratorService;
  private richtungRepository: RichtungRepository;

  constructor() {
    this.xlsxGenerator = new XlsxGeneratorService();
    this.richtungRepository = new RichtungRepository();
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
        | 'bedingung'
        | 'sender'
        | 'empfaenger',
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

    const richtungValues = await this.richtungRepository.getDistinctValues();
    const allowedSenderValues = richtungValues.sender;
    const allowedEmpfaengerValues = richtungValues.empfaenger;

    // Helper function to validate field names for TypeORM query builder methods
    // This prevents SQL injection by ensuring only whitelisted field names are used
    // All field names are validated against the allowedFields array before being used in queries
    const validateField = (field: string): string => {
      if (!(allowedFields as readonly string[]).includes(field)) {
        throw new Error(`Invalid field: ${field}`);
      }
      return field;
    };

    // SQLite's LOWER() only handles ASCII — LOWER('Ä') returns 'Ä', not 'ä'.
    // We wrap with REPLACE to normalize German umlauts so that case-insensitive
    // search works for both 'Änderung' and 'änderung'.
    // The JS side uses .toLowerCase() which handles Unicode correctly, so both sides
    // produce consistent lowercase output including umlauts.
    // See: https://github.com/Hochfrequenz/ahb-tabellen/issues/790
    const unicodeLower = (expr: string): string =>
      `REPLACE(REPLACE(REPLACE(LOWER(${expr}), 'Ä', 'ä'), 'Ö', 'ö'), 'Ü', 'ü')`;

    // Helper function to convert user wildcard patterns to SQL LIKE patterns
    // - If user enters "*", replace with "%" for SQL wildcard
    // - If no "*" is present, wrap with "%" for implicit substring matching
    // - Escapes SQL LIKE special characters: % and _ (single char wildcard)
    // IMPORTANT: All LIKE queries using this function must include ESCAPE '\\' clause
    // for SQLite to recognize the backslash as escape character
    const convertToLikePattern = (input: string): string => {
      if (input.includes('*')) {
        // User explicitly used wildcard - escape SQL special chars, then convert * to %
        return input.toLowerCase().replace(/%/g, '\\%').replace(/_/g, '\\_').replace(/\*/g, '%');
      }
      // No wildcard - use implicit substring matching (escape special chars first)
      const escaped = input.toLowerCase().replace(/%/g, '\\%').replace(/_/g, '\\_');
      return `%${escaped}%`;
    };

    // Helper function to apply filters to a query builder
    // This ensures consistent filtering logic between main query and count query
    const applyFilters = (
      queryBuilder: SelectQueryBuilder<AhbLine>,
      payload: {
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
            | 'bedingung'
            | 'sender'
            | 'empfaenger',
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
      }
    ) => {
      // Filters (AND) - Using TypeORM's parameterized query methods
      const filters = payload.filters ?? {};
      Object.entries(filters).forEach(([field, value]) => {
        if (!value) return;
        // Skip sender and empfaenger as they need special handling
        if (field === 'sender' || field === 'empfaenger') return;
        if (!(allowedFields as readonly string[]).includes(field)) return;

        const columnName = validateField(field);
        const paramBase = `f_${field}`;

        if (value.eq !== undefined) {
          queryBuilder.andWhere(`al.${columnName} = :${paramBase}_eq`, {
            [`${paramBase}_eq`]: value.eq,
          });
        }
        if (value.neq !== undefined) {
          queryBuilder.andWhere(
            `(al.${columnName} IS NULL OR al.${columnName} != :${paramBase}_neq)`,
            {
              [`${paramBase}_neq`]: value.neq,
            }
          );
        }
        if (value.contains !== undefined) {
          queryBuilder.andWhere(
            `${unicodeLower('al.' + columnName)} LIKE :${paramBase}_contains ESCAPE '\\'`,
            {
              [`${paramBase}_contains`]: convertToLikePattern(value.contains),
            }
          );
        }
        if (value.startsWith !== undefined) {
          queryBuilder.andWhere(`${unicodeLower('al.' + columnName)} LIKE :${paramBase}_starts`, {
            [`${paramBase}_starts`]: `${value.startsWith.toLowerCase()}%`,
          });
        }
        if (value.endsWith !== undefined) {
          queryBuilder.andWhere(`${unicodeLower('al.' + columnName)} LIKE :${paramBase}_ends`, {
            [`${paramBase}_ends`]: `%${value.endsWith.toLowerCase()}`,
          });
        }
        if (value.in && value.in.length > 0) {
          queryBuilder.andWhere(`al.${columnName} IN (:...${paramBase}_in)`, {
            [`${paramBase}_in`]: value.in,
          });
        }
        if (value.isNull) {
          queryBuilder.andWhere(`al.${columnName} IS NULL`);
        }
        if (value.isNotNull) {
          queryBuilder.andWhere(`al.${columnName} IS NOT NULL`);
        }
      });

      if (filters.sender?.in && filters.sender.in.length > 0) {
        const validSenders = filters.sender.in.filter(s => allowedSenderValues.includes(s));
        if (validSenders.length > 0) {
          const senderConditions = validSenders.map((sender, idx) => {
            const paramName = `sender_${idx}`;
            queryBuilder.setParameter(paramName, `%"sender": "${sender}"%`);
            return `al.direction LIKE :${paramName}`;
          });
          queryBuilder.andWhere(`(${senderConditions.join(' OR ')})`);
        }
      }

      if (filters.empfaenger?.in && filters.empfaenger.in.length > 0) {
        const validEmpfaenger = filters.empfaenger.in.filter(e =>
          allowedEmpfaengerValues.includes(e)
        );
        if (validEmpfaenger.length > 0) {
          const empfaengerConditions = validEmpfaenger.map((empfaenger, idx) => {
            const paramName = `empfaenger_${idx}`;
            queryBuilder.setParameter(paramName, `%"empfaenger": "${empfaenger}"%`);
            return `al.direction LIKE :${paramName}`;
          });
          queryBuilder.andWhere(`(${empfaengerConditions.join(' OR ')})`);
        }
      }

      // Global q across the 11 fields (case-insensitive LIKE) - Using TypeORM's parameterized methods
      // Supports wildcard search with * (e.g., "44*" matches "4400" but not "21044")
      const qRaw = (payload.q || '').trim();
      if (qRaw.length > 0) {
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

        const likePattern = convertToLikePattern(qRaw);

        // Use TypeORM's parameterized query methods - validate each field
        // Include ESCAPE clause for SQLite to recognize backslash as escape character
        const orConditions = qFields.map((field, idx) => {
          const columnName = validateField(field);
          return `${unicodeLower('al.' + columnName)} LIKE :q${idx} ESCAPE '\\'`;
        });

        const params = Object.fromEntries(qFields.map((_, idx) => [`q${idx}`, likePattern]));
        queryBuilder.andWhere(`(${orConditions.join(' OR ')})`, params);
      }
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

    // Apply filters using the reusable function
    applyFilters(qb, payload);

    // Sorting (allowlist) - Using TypeORM's parameterized query methods
    const sortRules = Array.isArray(payload.sort) ? payload.sort : [];
    if (sortRules.length === 0) {
      qb.addOrderBy('al.sort_path', 'ASC');
      qb.addOrderBy('al.pruefidentifikator', 'ASC');
    } else {
      sortRules.forEach((rule, idx) => {
        if (!rule || !(allowedFields as readonly string[]).includes(rule.field)) return;

        const columnName = validateField(rule.field);
        const dir = (rule.direction || 'asc').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        if (idx === 0) qb.orderBy(`al.${columnName}`, dir as 'ASC' | 'DESC');
        else qb.addOrderBy(`al.${columnName}`, dir as 'ASC' | 'DESC');
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

    // Create count query builder and apply the same filters securely
    // This prevents SQL injection by using TypeORM's parameterized query methods
    // instead of directly accessing expressionMap.wheres
    const countQb = AppDataSource.getRepository(AhbLine).createQueryBuilder('al');
    applyFilters(countQb, payload);

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

  private unfoldDirectionsLines(directions?: Kommunikationsrichtung[]): string {
    if (!directions || directions.length === 0)
      return 'MSCONS-Nachrichten können von verschiedenen Marktrollen gesendet und empfangen werden.';
    return directions.map(d => `${d.sender} → ${d.empfaenger}`).join(', ');
  }
  private mapMetaInformation(line: AhbLine, ahb: Anwendungshandbuch): Ahb['meta'] {
    return {
      description: line.description || '',
      direction: this.unfoldDirectionsLines(line.direction),
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
