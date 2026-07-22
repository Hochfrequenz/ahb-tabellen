import {
  Component,
  ElementRef,
  ViewChild,
  Renderer2,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-icon-copy-url',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './icon-copy-url.component.html',
})
export class IconCopyUrlComponent {
  private renderer = inject(Renderer2);

  @ViewChild('popover') popover!: ElementRef;

  onClickCopyUrl() {
    const currentUrl = window.location.href;

    navigator.clipboard.writeText(currentUrl).then(() => {
      this.showPopover();
      setTimeout(() => this.hidePopover(), 3000);
    });
  }

  private showPopover() {
    if (this.popover && this.popover.nativeElement) {
      this.renderer.removeClass(this.popover.nativeElement, 'invisible');
      this.renderer.removeClass(this.popover.nativeElement, 'opacity-0');
      this.renderer.addClass(this.popover.nativeElement, 'visible');
      this.renderer.addClass(this.popover.nativeElement, 'opacity-100');
    }
  }

  private hidePopover() {
    if (this.popover && this.popover.nativeElement) {
      this.renderer.addClass(this.popover.nativeElement, 'invisible');
      this.renderer.addClass(this.popover.nativeElement, 'opacity-0');
      this.renderer.removeClass(this.popover.nativeElement, 'visible');
      this.renderer.removeClass(this.popover.nativeElement, 'opacity-100');
    }
  }
}
