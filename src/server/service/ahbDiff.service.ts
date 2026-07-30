import AhbDiffRepository, {
  AhbDiffResult,
  AhbDiffSummary,
  PruefiDiffResult,
} from '../repository/ahbDiff';
import { ValidationError } from '../infrastructure/errors';
import { assertPruefi, resolveFormatVersion } from './validation';
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
    const resolvedNew = resolveFormatVersion(formatVersionNew, 'format-version-new');
    const resolvedOld = resolveFormatVersion(formatVersionOld, 'format-version-old');

    const result = await this.repository.getDiff(pruefi, resolvedNew, resolvedOld);

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
    const resolvedNew = resolveFormatVersion(formatVersionNew, 'format-version-new');
    const resolvedOld = resolveFormatVersion(formatVersionOld, 'format-version-old');

    return this.repository.getSummary(resolvedNew, resolvedOld);
  }

  public async getPruefiDiff(
    formatVersion: string,
    pruefiOld: string,
    pruefiNew: string
  ): Promise<PruefiDiffResult> {
    assertPruefi(pruefiOld);
    assertPruefi(pruefiNew);
    if (pruefiOld === pruefiNew) {
      throw new ValidationError(
        `Prüfidentifikator ${pruefiOld} cannot be compared with itself. Choose two different Prüfidentifikatoren.`
      );
    }
    const resolvedFormatVersion = resolveFormatVersion(formatVersion, 'format-version');

    const result = await this.repository.getPruefiDiff(resolvedFormatVersion, pruefiOld, pruefiNew);

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
}
