import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-solutions-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solutions-footer.component.html',
  styleUrl: './solutions-footer.component.scss',
})
export class SolutionsFooterComponent {
  public ahbTabellenUrl = environment.apiUrl;
  public fristenkalenderUrl = environment.fristenkalenderBaseUrl;
  public bedingungsbaumUrl = environment.bedingungsbaumBaseUrl;
  public ebdUrl = environment.ebdBaseUrl;
}
