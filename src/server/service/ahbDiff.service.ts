import AhbDiffRepository, { AhbDiffResult, AhbDiffSummary } from '../repository/ahbDiff';
import { assertPruefi, assertFormatVersion } from './validation';

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

    return this.repository.getDiff(pruefi, formatVersionNew, formatVersionOld);
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
