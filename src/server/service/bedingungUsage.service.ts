import BedingungUsageRepository, { BedingungUsageRow } from '../repository/bedingungUsage';
import { ValidationError } from '../infrastructure/errors';
import { assertPruefi, resolveFormatVersion } from './validation';
import { EdifactFormat } from '@hochfrequenz/efoli';

const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 1000;

/** Plain (`UTILMD`) and detailed (`UTILMDS`) formats efoli knows about. */
const KNOWN_FORMATS = new Set<string>(Object.values(EdifactFormat));

export interface BedingungUsageInput {
  formatVersion: string;
  bedingung: string;
  format?: string;
  pruefi?: string;
  limit?: number;
}

export interface BedingungUsageLine {
  segmentgroupKey: string | null;
  segmentCode: string | null;
  dataElement: string | null;
  qualifier: string | null;
  lineName: string | null;
  lineAhbStatus: string | null;
  /**
   * Position of the line in the AHB; sorts like the AHB and tells repeated segment groups apart
   * (their lines are otherwise identical).
   */
  sortPath: string;
  /** All ways the line reaches the condition; `null` = direct use. Sorted, `null` first. */
  via: (string | null)[];
}

export interface BedingungUsagePruefi {
  pruefidentifikator: string;
  description: string | null;
  lines: BedingungUsageLine[];
}

export interface BedingungUsageResult {
  formatVersion: string;
  bedingung: string;
  totalLines: number;
  returnedLines: number;
  truncated: boolean;
  pruefis: BedingungUsagePruefi[];
}

/**
 * Normalize a user-supplied condition key: strip whitespace and brackets, uppercase letters
 * (`[ ub1 ]` -> `UB1`, `2p` -> `2P`).
 * @throws {@link ValidationError} if nothing remains.
 */
export function normalizeBedingung(value: string): string {
  const key = value.replace(/[\s[\]]/g, '').toUpperCase();
  if (key === '') {
    throw new ValidationError(
      'bedingung must not be empty (expected e.g. "931", "[931]" or "UB1").'
    );
  }
  return key;
}

function compareVia(a: string | null, b: string | null): number {
  if (a === b) return 0;
  if (a === null) return -1;
  if (b === null) return 1;
  return a < b ? -1 : 1;
}

/** "Where is condition X used?" — direct and via packages / UB conditions. */
export default class BedingungUsageService {
  private repository: BedingungUsageRepository;

  constructor(repository?: BedingungUsageRepository) {
    this.repository = repository ?? new BedingungUsageRepository();
  }

  public async searchBedingungUsage(input: BedingungUsageInput): Promise<BedingungUsageResult> {
    const formatVersion = resolveFormatVersion(input.formatVersion);
    const conditionKey = normalizeBedingung(input.bedingung);
    if (input.pruefi !== undefined) {
      assertPruefi(input.pruefi);
    }
    const limit = input.limit ?? DEFAULT_LIMIT;
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      throw new ValidationError(`limit must be an integer between 1 and ${MAX_LIMIT}.`);
    }
    const format = input.format?.trim().toUpperCase() || undefined;
    if (format !== undefined && !KNOWN_FORMATS.has(format)) {
      throw new ValidationError(
        `Invalid format: ${input.format}. Expected an EDIFACT format such as "UTILMD" or "UTILMDS".`
      );
    }

    const { totalLines, rows } = await this.repository.findUsages({
      formatVersion,
      conditionKey,
      format,
      pruefi: input.pruefi,
      limit,
    });

    const pruefis = this.group(rows);
    const returnedLines = pruefis.reduce((sum, p) => sum + p.lines.length, 0);
    return {
      formatVersion,
      bedingung: conditionKey,
      totalLines,
      returnedLines,
      truncated: returnedLines < totalLines,
      pruefis,
    };
  }

  /** Rows arrive ordered by Prüfidentifikator, sort_path; one line may span several rows (one per via). */
  private group(rows: BedingungUsageRow[]): BedingungUsagePruefi[] {
    const pruefis: BedingungUsagePruefi[] = [];
    let current: BedingungUsagePruefi | undefined;
    let lastSortPath: string | undefined;
    for (const row of rows) {
      if (current?.pruefidentifikator !== row.pruefidentifikator) {
        current = {
          pruefidentifikator: row.pruefidentifikator,
          description: row.description,
          lines: [],
        };
        pruefis.push(current);
        lastSortPath = undefined;
      }
      if (row.sort_path !== lastSortPath) {
        current.lines.push({
          segmentgroupKey: row.segmentgroup_key,
          segmentCode: row.segment_code,
          dataElement: row.data_element,
          qualifier: row.qualifier,
          lineName: row.line_name,
          lineAhbStatus: row.line_ahb_status,
          sortPath: row.sort_path,
          via: [],
        });
        lastSortPath = row.sort_path;
      }
      const line = current.lines[current.lines.length - 1];
      if (!line.via.includes(row.via)) {
        line.via.push(row.via);
      }
    }
    for (const p of pruefis) {
      for (const line of p.lines) {
        line.via.sort(compareVia);
      }
    }
    return pruefis;
  }
}
