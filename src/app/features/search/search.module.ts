import { NgModule } from '@angular/core';
import { SearchService } from './services/search.service';
import { FormatVersionCacheService } from './services/format-version-cache.service';

@NgModule({
  providers: [SearchService, FormatVersionCacheService],
})
export class SearchModule {}
