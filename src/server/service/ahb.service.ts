import { Ahb } from '../../app/core/api/models';
import AHBRepository, { FileType, SearchPayload, SearchResult } from '../repository/ahb';
import { ValidationError } from '../infrastructure/errors';
import { assertPruefi, assertFormatVersion, parseFileType } from './validation';

/**
 * Transport-agnostic application logic for AHB retrieval and search.
 *
 * Knows nothing about Express/HTTP or MCP: it validates primitive inputs, resolves
 * the requested file type, delegates to {@link AHBRepository}, and returns domain data
 * (or throws an {@link AppError} subclass). Each transport adapter is responsible for
 * serialization and protocol-specific concerns (headers, content types, ...).
 */
export default class AhbService {
  private repository: AHBRepository;

  constructor(repository?: AHBRepository) {
    this.repository = repository ?? new AHBRepository();
  }

  /**
   * Retrieve an AHB for a given Prüfidentifikator and format version.
   * Returns the resolved {@link FileType} alongside the content so the caller can
   * choose how to serialize it (JSON body vs. binary download).
   */
  public async getAhb(
    pruefi: string,
    formatVersion: string,
    format: string
  ): Promise<{ fileType: FileType; content: Ahb | Buffer }> {
    assertPruefi(pruefi);
    assertFormatVersion(formatVersion);

    const fileType = parseFileType(format);
    const content = await this.repository.get(pruefi, formatVersion, fileType);

    return { fileType, content };
  }

  /**
   * Full-text / filtered search over AHB lines. Validates the payload shape before
   * delegating to the repository.
   */
  public async searchAhbLines(payload: SearchPayload): Promise<SearchResult> {
    if (typeof payload?.page !== 'number' || payload.page < 1) {
      throw new ValidationError('page must be a positive integer');
    }
    if (typeof payload.pageSize !== 'number' || payload.pageSize < 1) {
      throw new ValidationError('pageSize must be a positive integer');
    }
    if (!Array.isArray(payload.sort)) {
      throw new ValidationError('sort must be an array');
    }
    if (typeof payload.q !== 'string') {
      throw new ValidationError('q must be a string');
    }

    // Whitelist the known fields (as the controller did before) so stray body
    // keys never reach the repository.
    const { page, pageSize, sort, q, filters } = payload;
    return this.repository.searchAhbLines({ page, pageSize, sort, q, filters });
  }
}
