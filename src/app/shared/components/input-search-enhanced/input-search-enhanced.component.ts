import {
  Component,
  effect,
  input,
  output,
  ChangeDetectionStrategy,
  linkedSignal,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IconMagnifyingGlassComponent } from '../icon-magnifying-glass/icon-magnifying-glass.component';
import { IconArrowLeftComponent } from '../icon-arrow-left/icon-arrow-left.component';
import { IconArrowRightComponent } from '../icon-arrow-right/icon-arrow-right.component';

@Component({
  selector: 'app-input-search-enhanced',
  standalone: true,
  imports: [
    FormsModule,
    IconMagnifyingGlassComponent,
    IconArrowLeftComponent,
    IconArrowRightComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './input-search-enhanced.component.html',
})
export class InputSearchEnhancedComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  selectedPosition = input<number | undefined>();
  totalResults = input<number | undefined>();

  searchQueryChange = output<string | undefined>();
  keyupEnter = output();
  nextClick = output();
  previousClick = output();

  searchQueryInput = input<string>(undefined, { alias: 'searchQuery' });
  searchQuery = linkedSignal(this.searchQueryInput);

  constructor() {
    // Read query parameters on initialization
    this.route.queryParams.subscribe(params => {
      const query = params['query'];
      if (query) {
        this.searchQuery.set(query);
      }
    });

    // Emit search query changes and update the URL
    effect(() => {
      const currentQuery = this.searchQuery();
      this.searchQueryChange.emit(currentQuery);
      this.updateURL(currentQuery);
    });
  }

  // Handle Enter and Shift+Enter key press to navigate
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Shift+Enter goes to previous result
        event.preventDefault();
        this.previousClick.emit();
      } else {
        // Enter goes to next result
        event.preventDefault();
        this.nextClick.emit();
      }
    }
  }

  updateURL(query: string | undefined): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { query: query || null },
      queryParamsHandling: 'merge',
    });
  }
}
