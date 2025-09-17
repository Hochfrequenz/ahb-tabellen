import { NgModule } from '@angular/core';
import { SearchRoutingModule } from './search.routes';
import { SearchService } from './services/search.service';

@NgModule({
  imports: [SearchRoutingModule],
  providers: [SearchService],
})
export class SearchModule {}
