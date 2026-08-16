import { Component, ChangeDetectionStrategy } from '@angular/core';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-solutions-footer',
  standalone: true,
  imports: [],
  templateUrl: './solutions-footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './solutions-footer.component.scss',
})
export class SolutionsFooterComponent {
  public ahbTabellenUrl = environment.apiUrl;
  public fristenkalenderUrl = environment.fristenkalenderBaseUrl;
  public bedingungsbaumUrl = environment.bedingungsbaumBaseUrl;
  public ebdUrl = environment.ebdBaseUrl;
  public makoProzesseUrl = environment.makoProzesseBaseUrl;
  public dolmetscherUrl = environment.dolmetscherBaseUrl;
}
