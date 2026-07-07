import AhbDiffRepository, { AhbDiffResult, AhbDiffSummary } from '../repository/ahbDiff';
import { assertPruefi, assertFormatVersion } from './validation';
import { extractEbdKey } from './ebd';

/**
 * Transport-agnostic application logic for AHB version diffs.
 * Validates inputs and delegates to {@link AhbDiffRepository}; performs no serialization.
 */
export default class AhbDiffService {
  private repository: AhbDiffRepository;

  constructor(repository?: AhbDiffRepository) {
    this.repository = repository ?? new AhbDiffRepository();
  }

  public async getDiff(
    pruefi: string,
    formatVersionNew: string,
    formatVersionOld: string
  ): Promise<AhbDiffResult> {
    assertPruefi(pruefi);
    assertFormatVersion(formatVersionNew, 'format-version-new');
    assertFormatVersion(formatVersionOld, 'format-version-old');

    const result = await this.repository.getDiff(pruefi, formatVersionNew, formatVersionOld);

    // Detect the EBD key per side (single source of truth; consumers build their links).
    for (const line of result.lines) {
      if (line.old) {
        line.old.ebd_key = extractEbdKey(line.old.qualifier);
      }
      if (line.new) {
        line.new.ebd_key = extractEbdKey(line.new.qualifier);
      }
    }

    return result;
  }

  public async getSummary(
    formatVersionNew: string,
    formatVersionOld: string
  ): Promise<AhbDiffSummary> {
    assertFormatVersion(formatVersionNew, 'format-version-new');
    assertFormatVersion(formatVersionOld, 'format-version-old');

    return this.repository.getSummary(formatVersionNew, formatVersionOld);
  }
}
