import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface HighlightResult {
  html: SafeHtml;
  hasMatch: boolean;
  needsExpansion: boolean;
}

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  private readonly domSanitizer = inject(DomSanitizer);

  transform(value: string | undefined, highlightText: string | undefined): SafeHtml;
  transform(
    value: string | undefined,
    highlightText: string | undefined,
    fullText?: string,
    isExpanded?: boolean
  ): HighlightResult;
  transform(
    value: string | undefined,
    highlightText: string | undefined,
    fullText?: string,
    isExpanded?: boolean
  ): SafeHtml | HighlightResult {
    if (!value) {
      const emptyResult = this.domSanitizer.bypassSecurityTrustHtml('');
      return fullText !== undefined
        ? { html: emptyResult, hasMatch: false, needsExpansion: false }
        : emptyResult;
    }
    if (!highlightText) {
      const noHighlightResult = this.domSanitizer.bypassSecurityTrustHtml(value);
      return fullText !== undefined
        ? { html: noHighlightResult, hasMatch: false, needsExpansion: false }
        : noHighlightResult;
    }

    const regex = new RegExp(highlightText, 'gi');

    // If this is the enhanced version with full text checking
    if (fullText !== undefined) {
      const hasMatchInDisplayed = regex.test(value);
      const hasMatchInFull = regex.test(fullText);
      const needsExpansion = hasMatchInFull && !hasMatchInDisplayed && !isExpanded;

      // Reset regex lastIndex for actual replacement
      regex.lastIndex = 0;
      const html = value.replace(regex, match => `<mark>${match}</mark>`);

      return {
        html: this.domSanitizer.bypassSecurityTrustHtml(html),
        hasMatch: hasMatchInDisplayed,
        needsExpansion,
      };
    }

    // Original behavior for backward compatibility
    const html = value.replace(regex, match => `<mark>${match}</mark>`);
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }
}
